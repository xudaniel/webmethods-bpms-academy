import itertools, math, heapq
# 1 simplex example: max 2x+3y, x+y<=4, x+3y<=6
corners=[(0,0),(4,0),(0,2),(3,1)]
print("LP corners",[(c,2*c[0]+3*c[1]) for c in corners])
# 3 cut: max x+y, 2x+2y<=3 integer
print("cut best int",max(x+y for x in range(3) for y in range(3) if 2*x+2*y<=3))
# 5 duty: days 1..3, B=A+1, C!=3, alldiff
print("duty",[(a,b,c) for a,b,c in itertools.permutations([1,2,3]) if b==a+1 and c!=3])
# 7 routing
P={'W':(0,0),'A':(1,0),'B':(4,0),'C':(4,3),'D':(1,3)}
d=lambda p,q: math.dist(P[p],P[q])
def L(r): return sum(d(r[i],r[i+1]) for i in range(len(r)-1))
# nearest neighbour
cur='W'; left=set('ABCD'); r=['W']
while left:
    n=min(sorted(left),key=lambda x:d(cur,x)); r.append(n); left.remove(n); cur=n
r.append('W'); print("NN",r,round(L(r),2))
best=min((['W',*p,'W'] for p in itertools.permutations('ABCD')),key=L); print("opt",best,round(L(best),2))
# 8 dijkstra
G={'家':{'A':2,'B':5},'A':{'B':1,'公司':6},'B':{'公司':2},'公司':{}}
dist={'家':0};pq=[(0,'家')]
while pq:
    dd,u=heapq.heappop(pq)
    if dd>dist.get(u,1e9):continue
    for v,w in G[u].items():
        if dd+w<dist.get(v,1e9): dist[v]=dd+w; heapq.heappush(pq,(dd+w,v))
print("dijkstra",dist)
# hungarian brute
M=[[9,2,7],[6,4,3],[5,8,1]]
print("assign",min((sum(M[i][p[i]] for i in range(3)),p) for p in itertools.permutations(range(3))))
