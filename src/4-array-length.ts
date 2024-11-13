// TypeScript 的类型系统是图灵完备的，当然不乏数值计算相关的逻辑
// 在 TS 中实现数值计算，需要借助数组的长度做计数

type num1 = [unknown]['length']
type num2 = [unknown, unknown]['length']
type num3 = [unknown, unknown, unknown]['length']

// TypeScript 类型系统中没有加减乘除运算符
// 但是可以通过构造不同的数组然后取 length 的方式来完成数值计算
// 把数值的加减乘除转化为对数组的提取和构造

// 1. 加减乘除

// BuildArray - 构造指定长度的数组，方便后续直接 ['length'] 取到长度方便计算
type BuildArray<
  Length extends number,
  Ele = unknown,
  Arr extends unknown[] = []
> = Arr['length'] extends Length ? Arr : BuildArray<Length, Ele, [...Arr, Ele]>

// 1.1 Add - 两个数字相加
type Add<Num1 extends number, Num2 extends number> = [
  ...BuildArray<Num1>,
  ...BuildArray<Num2>
]['length']
type Res1 = Add<200, 400>

// 1.2 Subtract - 两个数字相减
type Subtract<
  Num1 extends number,
  Num2 extends number
> = BuildArray<Num1> extends [...BuildArray<Num2>, ...arr2: infer Rest]
  ? Rest['length']
  : never
type Res2 = Subtract<100, 99>

// 1.3 Multiply - 两个数字相乘
type Multiply<
  Num1 extends number,
  Num2 extends number,
  Res extends unknown[] = []
> = Num2 extends 0
  ? Res['length']
  : Multiply<Num1, Subtract<Num2, 1>, [...BuildArray<Num1>, ...Res]>
type Res3 = Multiply<12, 32>

// 1.4 Divide - 两个数字相除
type Divide<
  Num1 extends number,
  Num2 extends number,
  CountArr extends unknown[] = []
> = Num1 extends 0
  ? CountArr['length']
  : Divide<Subtract<Num1, Num2>, Num2, [unknown, ...CountArr]>
type Res4 = Divide<30, 6>

// 2. 数组长度实现计数

// 2.1 StrLen - 获取字符串的长度
type StrLen<
  Str extends string,
  CountArr extends unknown[] = []
> = Str extends `${string}${infer Rest}`
  ? StrLen<Rest, [...CountArr, unknown]>
  : CountArr['length']
type Res5 = StrLen<'non_hana'>

// 2.2 GreaterThan - 比较两个数值的大小
type GreaterThan<
  Num1 extends number,
  Num2 extends number,
  CountArr extends unknown[] = []
> = Num1 extends Num2
  ? false
  : CountArr['length'] extends Num2
  ? true
  : CountArr['length'] extends Num1
  ? false
  : GreaterThan<Num1, Num2, [...CountArr, unknown]>
type Res6 = GreaterThan<1, 2>

// 2.3 Fibonacci - 斐波那契数列
type FibonacciLoop<
  PrevArr extends unknown[],
  CurrentArr extends unknown[],
  IndexArr extends unknown[] = [],
  Num extends number = 1
> = IndexArr['length'] extends Num
  ? CurrentArr['length']
  : FibonacciLoop<
      CurrentArr,
      [...PrevArr, ...CurrentArr],
      [...IndexArr, unknown],
      Num
    >
type Fibonacci<Num extends number> = FibonacciLoop<[1], [], [], Num>
type Res7 = Fibonacci<10>
