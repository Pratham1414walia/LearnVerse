#include<bits/stdc++.h>
using namespace std;
typedef long long ll;
bool isPerfectSquare(long double x){if (x >= 0) {long long sr = sqrt(x);return (sr * sr == x);}return false;}
int hcf(int a,int b){if(a==0){return b;} return hcf(b%a,a);}
int lcm(int a,int b){return (a/hcf(a,b))*b;}


vector<long> maxSubsetSum(vector<int> k){
    vector<long> ans;
    long n = k.size();
    for(long i=0;i<n;i++){
        long num = k[i];
        long temp = 0;
        for(int j=1;j<=num;j++){
            if(num%j==0) temp+=j;
        }
        ans.push_back(temp);
    }
    return ans;
}


int main(){
ios_base::sync_with_stdio(false); cin.tie(0); cout.tie(0);
ll t=1;
// cin>>t;
while(t--){
// solve();
vector<int> k = {2,4};
vector<long> ans = maxSubsetSum(k);
cout<<ans[0]<<" "<<ans[1]<<endl;
}
return 0;
}