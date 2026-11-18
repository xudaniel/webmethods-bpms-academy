/* simple_demo.c — two everyday examples of the core solver ideas.
 * 1) Branch and bound: spend 10 yuan on snacks for the most happiness.
 * 2) Constraint propagation: seat three friends; the rules alone solve it.
 * Build: gcc -O2 -Wall -o simple_demo simple_demo.c && ./simple_demo
 */
#include <stdio.h>

/* ---------- 1. Branch and bound (snacks, budget 10) ---------- */
/* Sorted by happiness per yuan: cola 1.25, chocolate 1.2, chips 1.17 */
const char *snack[3] = { "cola", "chocolate", "chips" };
int price[3] = { 4, 5, 6 };
int joy[3]   = { 5, 6, 7 };
int best = 0, take[3], best_take[3];

/* Upper bound: fill the rest of the budget greedily, allowing half a bag. */
double bound(int i, int money, int happy)
{
    double b = happy;
    for (; i < 3; i++) {
        if (price[i] <= money) { money -= price[i]; b += joy[i]; }
        else { b += joy[i] * (double)money / price[i]; break; }
    }
    return b;
}

void bb(int i, int money, int happy)
{
    if (i == 3) {
        if (happy > best) { best = happy; for (int k = 0; k < 3; k++) best_take[k] = take[k]; }
        return;
    }
    if (bound(i, money, happy) <= best) {           /* cannot beat best: prune */
        printf("  prune at %s: bound %.2f <= best %d\n", snack[i], bound(i, money, happy), best);
        return;
    }
    if (price[i] <= money) { take[i] = 1; bb(i + 1, money - price[i], happy + joy[i]); }
    take[i] = 0; bb(i + 1, money, happy);           /* branch: buy it, or not */
}

/* ---------- 2. Propagation (three seats, 1..3) ---------- */
/* Rules: Ming not in seat 1; Hong sits right of Ming (Hong = Ming + 1);
 * Gang not in seat 3; everyone in a different seat. Domains as bitmasks. */
int has(int d, int v) { return d & (1 << v); }

int main(void)
{
    printf("1) Snacks, budget 10\n");
    printf("  root bound (half bags allowed): %.2f\n", bound(0, 10, 0));
    bb(0, 10, 0);
    printf("  best happiness %d:", best);
    for (int k = 0; k < 3; k++) if (best_take[k]) printf(" %s", snack[k]);
    printf("\n\n2) Seats\n");

    int all = (1 << 1) | (1 << 2) | (1 << 3);
    int ming = all & ~(1 << 1), hong = all, gang = all & ~(1 << 3);
    int changed = 1, round = 0;
    while (changed) {                                /* propagate to a fixed point */
        int m0 = ming, h0 = hong, g0 = gang, nm = 0, nh = 0;
        for (int v = 1; v <= 3; v++) {               /* Hong = Ming + 1 */
            if (has(ming, v) && v + 1 <= 3 && has(hong, v + 1)) nm |= 1 << v;
            if (has(hong, v) && v - 1 >= 1 && has(ming, v - 1)) nh |= 1 << v;
        }
        ming = nm; hong = nh;
        int fixed[3] = { ming, hong, gang };         /* all different */
        for (int a = 0; a < 3; a++)
            if (__builtin_popcount(fixed[a]) == 1) {
                if (a != 0) ming &= ~fixed[a];
                if (a != 1) hong &= ~fixed[a];
                if (a != 2) gang &= ~fixed[a];
            }
        changed = (ming != m0 || hong != h0 || gang != g0);
        printf("  round %d: Ming {%s%s%s} Hong {%s%s%s} Gang {%s%s%s}\n", ++round,
               has(ming,1)?"1":"", has(ming,2)?"2":"", has(ming,3)?"3":"",
               has(hong,1)?"1":"", has(hong,2)?"2":"", has(hong,3)?"3":"",
               has(gang,1)?"1":"", has(gang,2)?"2":"", has(gang,3)?"3":"");
    }
    printf("  solved by propagation alone, no guessing needed\n");
    return 0;
}
