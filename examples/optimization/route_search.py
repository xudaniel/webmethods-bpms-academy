import itertools
pts=[(x,y) for x in range(0,5) for y in range(0,4)]
def d(p,q): return abs(p[0]-q[0])+abs(p[1]-q[1])
def L(r): return sum(d(r[i],r[i+1]) for i in range(len(r)-1))
W=(0,0)
for combo in itertools.combinations([p for p in pts if p!=W],4):
    cur=W; left=list(combo); r=[W]; ok=True
    while left:
        ds=sorted(d(cur,x) for x in left)
        if len(ds)>1 and ds[0]==ds[1]: ok=False;break
        n=min(left,key=lambda x:d(cur,x)); r.append(n); left.remove(n); cur=n
    if not ok: continue
    r.append(W)
    best=min((L([W,*p,W]),p) for p in itertools.permutations(combo))
    if L(r)-best[0]>=4:
        # check a single 2-opt reversal reaches optimum
        for i in range(1,5):
            for j in range(i+1,5):
                r2=r[:i]+r[i:j+1][::-1]+r[j+1:]
                if L(r2)==best[0]:
                    print(combo,r,L(r),r2,L(r2)); raise SystemExit
