// TypeScript 类型系统支持 3 种可以声明任意类型的变量：type、infer、类型参数

// type: 即类型别名，声明一个变量存储某个类型
type non_hana = Promise<number>

// infer: 类型提取，提取出一个类型后存储到一个变量当中，相当于局部变量
type GetValueType<P> = P extends Promise<infer Value> ? Value : never

// 类型参数: 用于接受具体的类型，在类型运算中相当于局部变量
type isTwo<T> = T extends 2 ? true : false

// TypeScript 的 type、infer、类型参数声明的变量都不能修改
// 想对类型做各种变换产生新的类型就需要重新构造。

// 1. 数组类型的重新构造
type Tuple1 = [1, 2]
type Tuple2 = ['a', 'b']

// 1.1 Push - 往数组末尾添加一个元素
type Push<Arr extends unknown[], Ele> = [...Arr, Ele]
type Res1 = Push<Tuple1, 4>

// 1.2 Unshift - 往数组开头添加一个元素
type Unshift<Arr extends unknown[], Ele> = [Ele, ...Arr]
type Res2 = Unshift<Tuple1, 0>

// 1.3 Zip - 合并两个元组
type ZipTwo<
  One extends [unknown, unknown],
  Other extends [unknown, unknown]
> = One extends [infer OneFirst, infer OneSecond]
  ? Other extends [infer OtherFirst, infer OtherSecond]
    ? [[OneFirst, OtherFirst], [OneSecond, OtherSecond]]
    : []
  : []
type Res3 = ZipTwo<Tuple1, Tuple2>

type Zip<One extends unknown[], Other extends unknown[]> = One extends [
  infer OneFirst,
  ...infer OneRest
]
  ? Other extends [infer OtherFirst, ...infer OtherRest]
    ? [[OneFirst, OtherFirst], ...Zip<OneRest, OtherRest>]
    : []
  : []
type Res4 = Zip<Tuple1, Tuple2>

// 2. 字符串类型的重新构造

// 2.1 CapitalizeStr - 首字母大写
type CapitalizeStr<Str extends string> =
  Str extends `${infer First}${infer Rest}` ? `${Uppercase<First>}${Rest}` : Str
type Res5 = CapitalizeStr<'non_hana'>

// 2.2 CamelCase - 驼峰命名法
type CamelCase<Str extends string> =
  Str extends `${infer Left}_${infer Right}${infer Rest}`
    ? `${Left}${Uppercase<Right>}${CamelCase<Rest>}`
    : Str
type Res6 = CamelCase<'non_hana_hana'>

// 2.3 DropSubStr - 删除部分字符串
type DropSubStr<
  Str extends string,
  SubStr extends string
> = Str extends `${infer Prefix}${SubStr}${infer Suffix}`
  ? DropSubStr<`${Prefix}${Suffix}`, SubStr>
  : Str
type Res7 = DropSubStr<'non_hana___', '_'>

// 3. 函数类型的重新构造

// 3.1 AppendArgument - 给已有的函数类型加上一个参数
type AppendArgument<Func extends Function, Arg> = Func extends (
  ...args: infer Args
) => infer ReturnType
  ? (...args: [...Args, Arg]) => ReturnType
  : never
type Res8 = AppendArgument<() => void, string>

// 4. 索引类型的重新构造

// 索引类型是聚合多个元素的类型，class、对象等都是索引类型
type obj = {
  name: string
  age: number
  gender: boolean
}

// 4.1 Mapping - 对 value 的属性做修改
// keyof 能够取出某个 Object 的索引
type Mapping<Obj extends object> = {
  [Key in keyof Obj]: [Obj[Key], Obj[Key], Obj[Key]]
}
type Res9 = Mapping<{ a: string; b: string }>

// 4.2 UppercaseKey - 对 key 本身做修改
// as: 把左边的类型转为右边的类型
type UppercaseKey<Obj extends Record<string, any>> = {
  [Key in keyof Obj as Uppercase<Key & string>]: Obj[Key]
}
type Res10 = UppercaseKey<{ non: 1; hana: 2 }>

// 4.3 ToReadonly - 将对象变为只读
type ToReadonly<T> = {
  readonly [Key in keyof T]: T[Key]
}
type Res11 = ToReadonly<{ a: 1; b: 2 }>

// 4.4 ToPartial - 将对象变为可选
type ToPartial<T> = {
  [Key in keyof T]?: T[Key]
}
type Res12 = ToPartial<{ a: 1; b: 2 }>

// 4.5 ToMutable - 将对象变为必选
type ToMutable<T> = {
  -readonly [Key in keyof T]: T[Key]
}
type Res13 = ToMutable<Res11>

// 4.6 ToRequired - 将对象变为必选
type ToRequired<T> = {
  [Key in keyof T]-?: T[Key]
}
type Res14 = ToRequired<Res12>

// 4.7 FilterByValueType - 构造新索引类型时根据值的类型过滤
type FilterByValueType<Obj extends Record<string, any>, ValueType> = {
  [Key in keyof Obj as Obj[Key] extends ValueType ? Key : never]: Obj[Key]
}
type Res15 = FilterByValueType<{ a: 1 }, 0>
