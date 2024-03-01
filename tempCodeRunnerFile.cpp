#include<bits/stdc++.h>
using namespace std;
typedef long long ll;
bool isPerfectSquare(long double x){if (x >= 0) {long long sr = sqrt(x);return (sr * sr == x);}return false;}
ll hcf(ll a,ll b){if(a==0){return b;} return hcf(b%a,a);}
ll lcm(ll a,ll b){return (a/hcf(a,b))*b;}


void solve(){
    ll n;
    cin>>n;
    ll p = log(n)/log(2);
    ll ans = pow(2,p);
    cout<<ans<<endl;
}


ll main(){
ios_base::sync_with_stdio(false); cin.tie(0); cout.tie(0);
ll t=1;
cin>>t;
while(t--){
solve();
}
return 0;
}