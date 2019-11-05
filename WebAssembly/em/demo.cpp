#include <emscripten/val.h>
#include <emscripten/bind.h>
#include <string>
#include <algorithm>

using namespace emscripten;

std::string test()
{
    int w[5] = {0, 2, 3, 4, 5}; //商品的体积2、3、4、5
    int v[5] = {0, 3, 4, 5, 6}; //商品的价值3、4、5、6
    int bagV = 8;               //背包大小
    int dp[5][9] = {{0}};       //动态规划表
    std::string result = "";

    for (int i = 1; i <= 4; i++)
    {
        for (int j = 1; j <= bagV; j++)
        {
            if (j < w[i])
                dp[i][j] = dp[i - 1][j];
            else
                dp[i][j] = std::max(dp[i - 1][j], dp[i - 1][j - w[i]] + v[i]);
        }
    }

    for (int i = 0; i < 5; i++)
    {
        for (int j = 0; j < 9; j++)
        {
            result += "\t" + std::to_string(dp[i][j]);
        }

        result += "\n";
    }

    return result;
}

EMSCRIPTEN_BINDINGS(module)
{
    function("test", &test);
}