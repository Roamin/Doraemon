#include <emscripten.h>
#include <iostream>
using namespace std;
#include <algorithm>

int w[15] = {0, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14}; // 商品的体积2、3、4、5
int v[15] = {0, 3, 4, 5, 6, 11, 12, 13, 14, 15, 20, 21, 22}; // 商品的价值3、4、5、6
int bagV = 22;                                               // 背包大小
int dp[15][23] = {{0}};                                      // 动态规划表
int item[15];                                                // 最优解情况

void findMax()
{ // 动态规划
    for (int i = 1; i <= 14; i++)
    {
        for (int j = 1; j <= bagV; j++)
        {
            if (j < w[i])
                dp[i][j] = dp[i - 1][j];
            else
                dp[i][j] = max(dp[i - 1][j], dp[i - 1][j - w[i]] + v[i]);
        }
    }
}

void findWhat(int i, int j)
{ // 最优解情况
    if (i >= 0)
    {
        if (dp[i][j] == dp[i - 1][j])
        {
            item[i] = 0;
            findWhat(i - 1, j);
        }
        else if (j - w[i] >= 0 && dp[i][j] == dp[i - 1][j - w[i]] + v[i])
        {
            item[i] = 1;
            findWhat(i - 1, j - w[i]);
        }
    }
}

void print()
{
    // for (int i = 0; i < 15; i++)
    // { // 动态规划表输出
    //     for (int j = 0; j < 23; j++)
    //     {
    //         cout << dp[i][j] << '\t';
    //     }
    //     cout << endl;
    // }
    // cout << endl;

    // for (int i = 0; i < 15; i++) // 最优解输出
    //     cout << item[i] << '\t';
    // cout << endl;
}

int main()
{
    findMax();
    findWhat(14, 22);
    print();

    return 0;
}