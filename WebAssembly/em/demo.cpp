#include <emscripten/val.h>
#include <emscripten/bind.h>
#include <string>
#include <algorithm>

using namespace emscripten;

val get2XArray(double **arr, int y_len, int x_len)
{
    val ret = val::array();
    for (int i = 0; i < y_len; i++)
    {
        ret.set(i, val(typed_memory_view(x_len, arr[i])));
    }
    return ret;
}

EMSCRIPTEN_BINDINGS(module)
{
    function("get2XArray", &get2XArray);
}