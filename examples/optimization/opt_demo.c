/*
 * opt_demo.c — the two core optimization ideas behind CPLEX-style solvers,
 * in plain C, on the two toy examples from the Notion primer.
 *
 *   Part 1. Mixed-integer programming (MIP): branch and bound with an
 *           LP-relaxation lower bound. Assign work orders to electricians
 *           at minimum labour cost.
 *   Part 2. Constraint programming (CP): constraint propagation plus
 *           depth-first search. Sequence one technician's work orders
 *           with release times, deadlines and a precedence, finishing as
 *           early as possible.
 *
 * Teaching code: real solvers (CPLEX Optimizer, CP Optimizer) add presolve,
 * the simplex method for general LP bounds, cutting planes, primal
 * heuristics, much stronger propagation and large-neighbourhood search.
 *
 * Build: gcc -O2 -Wall -o opt_demo opt_demo.c
 * Run:   ./opt_demo
 */
#include <stdio.h>
#include <limits.h>

/* ------------------------------------------------------------------ */
/* Part 1. MIP by branch and bound                                     */
/* ------------------------------------------------------------------ */

#define NW 2                       /* workers     */
#define NT 3                       /* work orders */

static const char *wname[NW] = { "Zhang San", "Li Si" };
static const int   rate[NW]  = { 50, 40 };     /* cost per hour         */
static const int   cap[NW]   = { 6, 6 };       /* max hours per day     */
static const char  tname[NT] = { 'A', 'B', 'C' };
static const int   hours[NT] = { 3, 2, 4 };

static int used[NW];               /* hours already assigned per worker   */
static int assign_cur[NT], assign_best[NT];
static int best_cost = INT_MAX;
static long nodes = 0, pruned = 0;

/*
 * Lower bound = cost so far + LP relaxation of the rest.
 * In the relaxation a work order may be split between workers (the 0/1
 * variables become fractions in [0,1]). Here cost depends only on the
 * worker's hourly rate, so the relaxation's optimum is simple: pour the
 * remaining hours into the cheapest spare capacity first. In general a
 * solver gets this bound by running the simplex method on the LP.
 */
static int lower_bound(int k, int cost)
{
    int remaining = 0;
    for (int t = k; t < NT; t++) remaining += hours[t];

    int order[NW] = { 0, 1 };                       /* cheapest first */
    if (rate[order[1]] < rate[order[0]]) { order[0] = 1; order[1] = 0; }

    int lb = cost;
    for (int i = 0; i < NW && remaining > 0; i++) {
        int w = order[i];
        int spare = cap[w] - used[w];
        int take = remaining < spare ? remaining : spare;
        lb += take * rate[w];
        remaining -= take;
    }
    return remaining > 0 ? INT_MAX : lb;            /* INT_MAX = infeasible */
}

static void branch_and_bound(int k, int cost)
{
    nodes++;
    if (k == NT) {                                  /* every order assigned */
        if (cost < best_cost) {
            best_cost = cost;
            for (int t = 0; t < NT; t++) assign_best[t] = assign_cur[t];
        }
        return;
    }
    int lb = lower_bound(k, cost);
    if (lb >= best_cost) { pruned++; return; }      /* cannot beat incumbent */

    for (int w = 0; w < NW; w++) {                  /* branch: who does order k */
        if (used[w] + hours[k] > cap[w]) continue;  /* capacity constraint */
        used[w] += hours[k];
        assign_cur[k] = w;
        branch_and_bound(k + 1, cost + hours[k] * rate[w]);
        used[w] -= hours[k];
    }
}

static void run_mip(void)
{
    printf("== Part 1: MIP, branch and bound ==\n");
    printf("Root lower bound (LP relaxation): %d\n", lower_bound(0, 0));
    branch_and_bound(0, 0);
    printf("Best integer cost: %d  (nodes %ld, pruned %ld)\n", best_cost, nodes, pruned);
    for (int t = 0; t < NT; t++)
        printf("  Work order %c (%dh) -> %s\n", tname[t], hours[t], wname[assign_best[t]]);
    if (best_cost == lower_bound(0, 0))
        printf("Integer cost equals the root bound, so it is proven optimal (gap 0%%).\n\n");
}

/* ------------------------------------------------------------------ */
/* Part 2. CP: propagation + depth-first search                        */
/* ------------------------------------------------------------------ */

#define NJ 3
static const char cname[NJ]   = { 'A', 'B', 'C' };
static const int  dur[NJ]     = { 2, 1, 3 };     /* hours                 */
static const int  release[NJ] = { 8, 10, 8 };    /* earliest start (hour) */
static const int  deadline[NJ]= { 17, 17, 14 };  /* latest end (hour)     */
static const int  pred[NJ]    = { -1, 0, -1 };   /* B must follow A       */

static int start_cur[NJ], start_best[NJ], seq_cur[NJ], seq_best[NJ];
static int best_end = INT_MAX;
static long cp_nodes = 0, cp_fail = 0;

/*
 * Propagation after placing a job that ends at time `now`: every
 * unscheduled job j now has earliest start max(now, release[j]). If that
 * plus its duration overshoots its deadline, this branch is dead: fail
 * at once instead of searching further. (CP Optimizer uses far stronger
 * rules, such as edge-finding and timetabling, but the idea is the same.)
 */
static int propagate(int scheduled_mask, int now)
{
    for (int j = 0; j < NJ; j++) {
        if (scheduled_mask & (1 << j)) continue;
        int est = now > release[j] ? now : release[j];
        if (est + dur[j] > deadline[j]) return 0;
    }
    return 1;
}

static void dfs(int depth, int mask, int now)
{
    cp_nodes++;
    if (depth == NJ) {
        if (now < best_end) {
            best_end = now;
            for (int i = 0; i < NJ; i++) { start_best[i] = start_cur[i]; seq_best[i] = seq_cur[i]; }
        }
        return;
    }
    int rest = 0;                                    /* simple makespan bound */
    for (int j = 0; j < NJ; j++) if (!(mask & (1 << j))) rest += dur[j];
    if (now + rest >= best_end) { cp_fail++; return; }

    for (int j = 0; j < NJ; j++) {                   /* branch: which job next */
        if (mask & (1 << j)) continue;
        if (pred[j] >= 0 && !(mask & (1 << pred[j]))) continue;  /* precedence */
        int s = now > release[j] ? now : release[j];
        int e = s + dur[j];
        if (e > deadline[j]) { cp_fail++; continue; }
        if (!propagate(mask | (1 << j), e)) { cp_fail++; continue; }
        start_cur[j] = s;
        seq_cur[depth] = j;
        dfs(depth + 1, mask | (1 << j), e);
    }
}

static void run_cp(void)
{
    printf("== Part 2: CP, propagation + search ==\n");
    dfs(0, 0, 8);                                    /* the day starts at 8:00 */
    if (best_end == INT_MAX) { printf("No feasible schedule.\n"); return; }
    printf("Earliest finish: %d:00  (nodes %ld, failures/prunes %ld)\n", best_end, cp_nodes, cp_fail);
    for (int i = 0; i < NJ; i++) {
        int j = seq_best[i];
        printf("  %c  %2d:00-%2d:00  (release %d:00, deadline %d:00)\n",
               cname[j], start_best[j], start_best[j] + dur[j], release[j], deadline[j]);
    }
    printf("Total work is 6h from 8:00, so 14:00 is a proven lower bound: optimal.\n");
}

int main(void)
{
    run_mip();
    run_cp();
    return 0;
}
