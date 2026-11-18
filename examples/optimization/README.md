# Optimization primer: MIP, CP and their solvers

A short, runnable introduction to the two families of algorithms behind decision-optimization products such as IBM CPLEX Optimizer and CP Optimizer, and the open-source OR-Tools. It sits next to the Academy's decision-automation material: **rules** decide what is allowed, **optimization** decides what is best, **a process (BPMS)** carries the result out.

**Read it as a page:** [optimization.html](https://xudaniel.github.io/webmethods-bpms-academy/optimization.html) (English and 中文, with two demos that run in the browser).

Teaching examples written for this repo. Public concepts only. Not an official IBM resource.

## Two families

| | MIP (mixed-integer programming) | CP (constraint programming) |
| --- | --- | --- |
| Good at | amounts and cost: how many, how much | order and time: who, when, in what sequence |
| Core idea | LP relaxation gives a bound, branch and prune | propagate constraints, search, backtrack |
| IBM engine | CPLEX Optimizer | CP Optimizer |
| OR-Tools | linear solver wrapper (GLOP, SCIP, CPLEX, Gurobi) | CP-SAT |

## The algorithms, step by step

1. **Simplex (solve the LP relaxation).** Feasible region is a polygon; the optimum is at a corner. Start at a corner, move along the edge that improves the objective most, stop when no edge improves. *Example:* maximise 2x + 3y with x + y ≤ 4 and x + 3y ≤ 6: corners give 0, 8, 6, 9, so the answer is x = 3, y = 1, value 9.
2. **Branch and bound.** Solve the LP for a bound. If the solution is integer, keep it as the incumbent. Otherwise split on a fractional variable (buy / do not buy). Prune a branch whose bound is no better than the incumbent. *Example:* three snacks, budget 10: root bound 12.17, best integer 12, the "no cola" branch is bounded by 11.83 and pruned.
3. **Cutting planes.** Add a constraint that removes the fractional LP solution but no integer solution. *Example:* 2x ≤ 3 with integer x: the cut x ≤ 1 makes the LP answer integer at once.
4. **Constraint propagation.** Each variable has a domain; each constraint removes values that cannot be part of any solution; repeat until nothing changes; an empty domain means dead end. *Example:* A (2 h) before B (1 h), B must end by 12:00, day starts at 8:00: A starts 8–9, B starts 10–11, no guessing.
5. **Backtracking search.** Pick the variable with the smallest domain, try a value, propagate, back up on failure; after a solution, require a better objective and continue. *Example:* three duty days, B the day after A, C not on day 3: the only solution is C on day 1, A on day 2, B on day 3.
6. **CP-SAT (clause learning).** Model integers as Boolean literals; on a conflict, derive a new clause so the same mistake is never repeated; combine with LP bounds and several search strategies in parallel.
7. **Vehicle routing (local search).** Build a route greedily, improve it with local moves (2-opt reversal, swapping or relocating customers), escape local optima with a metaheuristic. Not a proof of optimality. *Example:* nearest-neighbour route of length 18 becomes 14 after one segment reversal (see `route_search.py`).
8. **Graph algorithms.** Dijkstra (settle the nearest unsettled node, relax its edges), max flow (push along an augmenting path, update residual capacity), Hungarian method (reduce rows and columns, match on zeros).

## Files

| File | What it shows | Run |
| --- | --- | --- |
| `simple_demo.c` | snack knapsack by branch and bound; seat puzzle by propagation | `gcc -O2 -o simple_demo simple_demo.c && ./simple_demo` |
| `opt_demo.c` | work-order assignment (MIP, answer 390) and technician schedule (CP, done at 14:00) | `gcc -O2 -o opt_demo opt_demo.c && ./opt_demo` |
| `solver_examples.py` | the same problems with OR-Tools (SCIP, CP-SAT) and IBM docplex / CPLEX | `pip install ortools docplex cplex && python3 solver_examples.py` |
| `algo_examples.py` | brute-force checks of the small examples above | `python3 algo_examples.py` |
| `route_search.py` | finds the small routing example where one reversal beats nearest-neighbour | `python3 route_search.py` |

Expected results: snacks 12; assignment 390 in both solvers; schedule 14:00 (OPTIMAL).

The CPLEX community edition has a size limit; OR-Tools is free and open source (Apache 2.0).

## What the toy code leaves out

Real solvers add presolve, general simplex and interior-point LP, many cut families, primal heuristics, far stronger propagation (edge finding, timetabling) and large-neighbourhood search.
