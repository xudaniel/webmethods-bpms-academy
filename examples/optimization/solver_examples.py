"""The three toy examples, rebuilt with real solvers.

1. Snacks (knapsack)            -> MIP with OR-Tools (SCIP)
2. Electricians (assignment)    -> MIP with OR-Tools, and the same model in
                                   IBM docplex solved by CPLEX Community Edition
3. One technician (scheduling)  -> CP with OR-Tools CP-SAT interval variables

Install: pip install ortools docplex cplex
Run:     python3 solver_examples.py

The point is modelling: decision variables, constraints, objective.
The solver does the branch and bound and the propagation for you.
"""
from ortools.linear_solver import pywraplp
from ortools.sat.python import cp_model


# 1. Knapsack: 10 yuan, buy each snack at most once, maximise happiness
def snacks():
    price = {"cola": 4, "chocolate": 5, "chips": 6}
    joy = {"cola": 5, "chocolate": 6, "chips": 7}
    s = pywraplp.Solver.CreateSolver("SCIP")
    buy = {k: s.BoolVar(f"buy_{k}") for k in price}            # variables: 0/1
    s.Add(sum(price[k] * buy[k] for k in price) <= 10)          # constraint: budget
    s.Maximize(sum(joy[k] * buy[k] for k in price))            # objective
    s.Solve()
    chosen = [k for k in price if buy[k].solution_value() > 0.5]
    print(f"1) Snacks: happiness {s.Objective().Value():.0f}, buy {chosen}")


# 2. Assignment: each work order to one electrician, max 6 hours each, min cost
WORKERS = {"Zhang San": 50, "Li Si": 40}                       # cost per hour
HOURS = {"A": 3, "B": 2, "C": 4}
CAP = 6


def electricians_ortools():
    s = pywraplp.Solver.CreateSolver("SCIP")
    x = {(w, t): s.BoolVar(f"x_{w}_{t}") for w in WORKERS for t in HOURS}
    for t in HOURS:                                             # one person per order
        s.Add(sum(x[w, t] for w in WORKERS) == 1)
    for w in WORKERS:                                           # 6-hour day
        s.Add(sum(HOURS[t] * x[w, t] for t in HOURS) <= CAP)
    s.Minimize(sum(WORKERS[w] * HOURS[t] * x[w, t] for w in WORKERS for t in HOURS))
    s.Solve()
    plan = {t: w for (w, t) in x if x[w, t].solution_value() > 0.5}
    print(f"2a) Electricians (OR-Tools): cost {s.Objective().Value():.0f}, {plan}")


def electricians_cplex():
    try:
        from docplex.mp.model import Model
    except ImportError:
        print("2b) docplex not installed; skipped")
        return
    m = Model("electricians")
    x = {(w, t): m.binary_var(name=f"x_{w}_{t}") for w in WORKERS for t in HOURS}
    for t in HOURS:
        m.add_constraint(m.sum(x[w, t] for w in WORKERS) == 1)
    for w in WORKERS:
        m.add_constraint(m.sum(HOURS[t] * x[w, t] for t in HOURS) <= CAP)
    m.minimize(m.sum(WORKERS[w] * HOURS[t] * x[w, t] for w in WORKERS for t in HOURS))
    sol = m.solve()
    plan = {t: w for (w, t) in x if sol.get_value(x[w, t]) > 0.5}
    print(f"2b) Electricians (CPLEX):    cost {sol.objective_value:.0f}, {plan}")


# 3. Scheduling: one technician, 8:00-17:00, finish everything as early as possible
def technician():
    jobs = {  # name: (duration h, earliest start, deadline)
        "A": (2, 8, 17),
        "B": (1, 10, 17),
        "C": (3, 8, 14),
    }
    m = cp_model.CpModel()
    start, end, iv = {}, {}, {}
    for j, (d, rel, dl) in jobs.items():
        start[j] = m.NewIntVar(rel, dl - d, f"start_{j}")       # time windows
        end[j] = m.NewIntVar(rel + d, dl, f"end_{j}")
        iv[j] = m.NewIntervalVar(start[j], d, end[j], f"job_{j}")
    m.AddNoOverlap(iv.values())                                 # one job at a time
    m.Add(end["A"] <= start["B"])                               # A before B
    makespan = m.NewIntVar(8, 17, "makespan")
    m.AddMaxEquality(makespan, end.values())
    m.Minimize(makespan)
    solver = cp_model.CpSolver()
    status = solver.Solve(m)
    order = sorted(jobs, key=lambda j: solver.Value(start[j]))
    slots = ", ".join(f"{j} {solver.Value(start[j])}:00-{solver.Value(end[j])}:00" for j in order)
    print(f"3) Technician: done at {solver.Value(makespan)}:00 "
          f"({solver.StatusName(status)}); {slots}")


if __name__ == "__main__":
    snacks()
    electricians_ortools()
    electricians_cplex()
    technician()
