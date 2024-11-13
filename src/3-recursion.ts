// 会做类型的提取和构造之后，我们已经能写出很多类型编程逻辑了
// 但是有时候提取或构造的数组元素个数不确定、字符串长度不确定、对象层数不确定
// 此时需要用一种手段去处理这些不确定：递归
// 在类型体操中，遇到数量不确定的问题，要条件反射的想到递归

// 1. Promise 递归复用
type ttt = Promise<Promise<Promise<Record<string, any>>>>

// 1.1 DeepPromiseValueType - 提取不确定层数的 Promise 中的 Value 类型的高级类型
type DeepPromiseValueType<P extends Promise<unknown>> = P extends Promise<
  infer ValueType
>
  ? ValueType extends Promise<unknown>
    ? DeepPromiseValueType<ValueType>
    : ValueType
  : never
type Res1 = DeepPromiseValueType<ttt>

type DeepPromiseValueType2<T> = T extends Promise<infer ValueType>
  ? DeepPromiseValueType2<ValueType>
  : T
type Res2 = DeepPromiseValueType2<ttt>

// 2. 数组递归复用
type arr = [1, 2, 3, 4, 5]

// 2.1 ReverseArr - 递归翻转数组
type ReverseArr<Arr extends unknown[]> = Arr extends [
  infer First,
  ...infer Rest
]
  ? [...ReverseArr<Rest>, First]
  : Arr
type Res3 = ReverseArr<arr>

// 2.2 Includes - 递归查找元素
// 判断两个类型是否相等。在 TS 类型系统当中，extends 就是 = 号。
type IsEqual<A, B> = (A extends B ? true : false) & (B extends A ? true : false)
type Includes<Arr extends unknown[], FindItem> = Arr extends [
  infer First,
  ...infer Rest
]
  ? IsEqual<First, FindItem> extends true
    ? true
    : Includes<Rest, FindItem>
  : false
type Res4 = Includes<[1, 2, 3, 4, 5], 2>

// 2.3 RemoveItem - 递归移除元素
type RemoveItem<
  Arr extends unknown[],
  Item,
  Result extends unknown[] = []
> = Arr extends [infer First, ...infer Rest]
  ? IsEqual<First, Item> extends true
    ? RemoveItem<Rest, Item, Result>
    : RemoveItem<Rest, Item, [...Result, First]>
  : Result
type Res5 = RemoveItem<[1, 2, 2, 3], 2>

// 2.4 BuildArray - 递归构造数组
type BuildArray<
  Length extends number,
  Ele = unknown,
  Arr extends unknown[] = []
> = Arr['length'] extends Length ? Arr : BuildArray<Length, Ele, [...Arr, Ele]>
type Res6 = BuildArray<5, number>

// 3. 字符串递归复用

// 3.1 ReplaceAll - 递归全部匹配到的字符串
// 这个只能匹配到第一个！
type ReplaceStr<
  Str extends string,
  From extends string,
  To extends string
> = Str extends `${infer Prefix}${From}${infer Suffix}`
  ? `${Prefix}${To}${Suffix}`
  : Str
type ReplaceAll<
  Str extends string,
  From extends string,
  To extends string
> = Str extends `${infer Left}${From}${infer Right}`
  ? `${Left}${To}${ReplaceAll<Right, From, To>}`
  : Str
type Res7 = ReplaceAll<'nnnnnnnn', 'n', 'a'>

// 3.2 StringToUnion - 将每个字符提取出作为联合类型
type StringToUnion<Str extends string> =
  Str extends `${infer One}${infer Right}` ? One | StringToUnion<Right> : never
type Res8 = StringToUnion<'hello'>

// 3.3 ReverseStr - 递归翻转字符串
type ReverseStr<
  Str extends string,
  Result extends string = ''
> = Str extends `${infer First}${infer Rest}`
  ? ReverseStr<Rest, `${First}${Result}`>
  : Result
type Res9 = ReverseStr<'non_hana'>

// 4. 对象类型递归复用

// 4.1 DeepReadonly - 循环递归添加只读属性
// 此处 Obj extends any 的作用是触发 TS 的属性计算，TS 的类型只有被用到的时候才会被计算
type DeepReadonly<Obj extends Record<string, any>> = Obj extends any
  ? {
      readonly [Key in keyof Obj]: Obj[Key] extends object
        ? Obj[Key] extends Function
          ? Obj[Key]
          : DeepReadonly<Obj[Key]>
        : Obj[Key]
    }
  : never
type Res10 = DeepReadonly<{
  a: {
    b: {
      c: {
        d: string
      }
    }
  }
}>
