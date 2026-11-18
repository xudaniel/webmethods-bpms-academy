"""Rules first, then optimization: the smallest decision-intelligence example.

Step 1 (rules, the job a business-rules engine such as IBM ODM does):
    a decision table says who is allowed to do which work order.
Step 2 (optimization, the job IBM CPLEX does):
    among the allowed pairs, assign every order at minimum labour cost.
Run with and without the rule to see what the rule costs.
"""
from ortools.linear_solver import pywraplp

WORKERS = {  # name: (cost per hour, certificates)
    "Zhang San": (50, {"high-voltage"}),
    "Li Si": (40, set()),
    "Wang Wu": (45, {"high-voltage"}),
}
ORDERS = {  # name: (hours, required certificate or None)
    "A": (3, None),
    "B": (2, None),
    "C": (4, "high-voltage"),
}
CAP = 6  # hours per worker per day


def eligibility(apply_rules=True):
    """Decision table: an order needing a certificate goes only to holders."""
    allowed, reasons = {}, []
    for w, (_, certs) in WORKERS.items():
        for o, (_, need) in ORDERS.items():
            ok = (not apply_rules) or need is None or need in certs
            allowed[w, o] = ok
            if not ok:
                reasons.append(f"{w} may not do {o}: needs {need}")
    return allowed, reasons


def assign(allowed, backend="SCIP"):
    s = pywraplp.Solver.CreateSolver(backend)
    x = {k: s.BoolVar(f"x_{k[0]}_{k[1]}") for k, ok in allowed.items() if ok}
    for o in ORDERS:
        s.Add(sum(v for (w, oo), v in x.items() if oo == o) == 1)
    for w in WORKERS:
        s.Add(sum(ORDERS[o][0] * v for (ww, o), v in x.items() if ww == w) <= CAP)
    s.Minimize(sum(WORKERS[w][0] * ORDERS[o][0] * v for (w, o), v in x.items()))
    if s.Solve() != pywraplp.Solver.OPTIMAL:
        return None, {}
    plan = {o: w for (w, o), v in x.items() if v.solution_value() > 0.5}
    return round(s.Objective().Value()), plan


def assign_cplex(allowed):
    from docplex.mp.model import Model
    m = Model("rules_plus_opt")
    x = {k: m.binary_var(name=f"x_{k[0]}_{k[1]}".replace(" ", "")) for k, ok in allowed.items() if ok}
    for o in ORDERS:
        m.add_constraint(m.sum(v for (w, oo), v in x.items() if oo == o) == 1)
    for w in WORKERS:
        m.add_constraint(m.sum(ORDERS[o][0] * v for (ww, o), v in x.items() if ww == w) <= CAP)
    m.minimize(m.sum(WORKERS[w][0] * ORDERS[o][0] * v for (w, o), v in x.items()))
    sol = m.solve()
    return round(sol.objective_value), {o: w for (w, o), v in x.items() if sol.get_value(v) > 0.5}


if __name__ == "__main__":
    free, _ = eligibility(apply_rules=False)
    ruled, why = eligibility(apply_rules=True)
    c0, p0 = assign(free)
    c1, p1 = assign(ruled)
    print("Rules fired:")
    for r in why:
        print("  " + r)
    print(f"Without the rule: cost {c0}, {dict(sorted(p0.items()))}")
    print(f"With the rule:    cost {c1}, {dict(sorted(p1.items()))}")
    print(f"Price of the rule: {c1 - c0}")
    try:
        c2, p2 = assign_cplex(ruled)
        print(f"CPLEX check:      cost {c2}, {dict(sorted(p2.items()))}")
    except ImportError:
        print("CPLEX check skipped (pip install docplex cplex)")
