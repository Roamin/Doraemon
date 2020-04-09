## 获取一个月有多少天

`new Date(year, monthIndex [, day [, hours [, minutes [, seconds [, milliseconds]]]]]);`

- year
  表示年份的整数值。 0 到 99 会被映射至 1900 年至 1999 年，其它值代表实际年份。参见 示例。
- monthIndex
  表示月份的整数值，从 0（1 月）到 11（12 月）。
- day 可选
  表示一个月中的第几天的整数值，从 1 开始。默认值为 1。
- hours 可选
  表示一天中的小时数的整数值 (24 小时制)。默认值为 0（午夜）。
- minutes 可选
  表示一个完整时间（如 01:10:00）中的分钟部分的整数值。默认值为 0。
- seconds 可选
  表示一个完整时间（如 01:10:00）中的秒部分的整数值。默认值为 0。
- milliseconds 可选
  表示一个完整时间的毫秒部分的整数值。默认值为 0。

day 设置 0 的时候，将返回上一个月的最后一天，这样通过 getDate 便可以得到一个月的天数

```js
new Date(year, month + 1, 0).getDate();

// new Date(2020, 1 + 1, 0).getDate(); // 29
```

## 单词匹配(含边界)

```js
function includeWord (text, word) {
  const reg = new RegExp(`(?<!\\w)(${word})(?!\\w)`, 'i') // 示例是大小写不敏感

  return reg.test(text)
}

includeWord('mobile_number', 'mobile') // false
includeWord('mobile number', 'mobile') // true
```
