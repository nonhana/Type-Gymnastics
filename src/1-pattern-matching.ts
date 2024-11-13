// TS 类型体操方式一：模式匹配
// Typescript 类型的模式匹配是通过 extends 对类型参数做匹配，
// 结果保存到通过 infer 声明的局部类型变量里，
// 如果匹配就能从该局部变量里拿到提取出的类型。

type p = Promise<'non_hana'>
type GetValue<P> = P extends Promise<infer Value> ? Value : never
type Res1 = GetValue<p> // 'non_hana'

// 1. 数组类型
type arr = [1, 2, 3]
// any 和 unknown 都表示任意的类型
// 但是 unknown 只能接收任意类型的值，在使用前需要对这个类型进行进一步的类型检查
// any 除了可以接收任意类型的值，还可以赋值给任意类型（除了 never）
type GetArrFirst<Arr extends unknown[]> = Arr extends [
  infer First,
  ...unknown[]
]
  ? First
  : never
type Res2 = GetArrFirst<arr> // 1
type GetArrLast<Arr extends unknown[]> = Arr extends [...unknown[], infer Last]
  ? Last
  : never
type Res3 = GetArrLast<arr> // 3
type PopArr<Arr extends unknown[]> = Arr extends [...infer R, unknown]
  ? R
  : never
type Res4 = PopArr<arr> // [1, 2]
type ShiftArr<Arr extends unknown[]> = Arr extends [unknown, ...infer R]
  ? R
  : never
type Res5 = ShiftArr<arr> // [2, 3]

// 2. 字符串类型
// 2.1 StartsWith - 判断字符串是否以某个前缀开头
type StartsWith<
  Str extends string,
  Prefix extends string
> = Str extends `${Prefix}${string}` ? true : false
type Res6 = StartsWith<'hana', 'h'> // true

// 2.2 replace - 替换字符串中的某个子串
type ReplaceStr<
  Str extends string,
  From extends string,
  To extends string
> = Str extends `${infer Prefix}${From}${infer Suffix}`
  ? `${Prefix}${To}${Suffix}`
  : Str
type Res7 = ReplaceStr<'hanahana', 'ha', 'HA'> // HAnAHAnA

// 2.3 Trim - 去除字符串首尾的空格
type TrimStrRight<Str extends string> = Str extends `${infer Rest}${
  | ' '
  | '\n'
  | '\t'}`
  ? TrimStrRight<Rest>
  : Str
type TrimStrLeft<Str extends string> = Str extends `${
  | ' '
  | '\n'
  | '\t'}${infer Rest}`
  ? TrimStrLeft<Rest>
  : Str
type TrimStr<Str extends string> = TrimStrLeft<TrimStrRight<Str>>
type Res8 = TrimStr<'  hana  \n'> // hana

// 3. 函数
// 3.1 GetParameters - 提取函数参数的类型
type GetParameters<Func extends Function> = Func extends (
  ...args: infer Args
) => unknown
  ? Args
  : never
type Res9 = GetParameters<(a: number, b: string) => void> // [number, string]

// 3.2 GetReturnType - 提取函数返回值的类型
type GetReturnType<Func extends Function> = Func extends (
  ...args: any[]
) => infer Return
  ? Return
  : never
type Res10 = GetReturnType<(a: number, b: string) => boolean> // boolean

// 3.3 GetThisParameterType - 提取函数的 this 参数类型
type GetThisParameterType<T> = T extends (
  this: infer ThisType,
  ...args: any[]
) => any
  ? ThisType
  : unknown
type Res11 = GetThisParameterType<(this: string) => void> // string

// 4. 构造器
interface Person {
  name: string
}
interface PersonConstructor {
  new (name: string): Person
}

// 4.1 GetInstanceType - 提取构造器的实例类型
// 类型参数 ConstructorType 是待处理的类型，通过 extends 约束为构造器类型。
// 构造器类型的一般写法：new (...args: any) => any，意味着可以通过 new 关键字调用的函数。
type GetInstanceType<ConstructorType extends new (...args: any) => any> =
  ConstructorType extends new (...args: any) => infer InstanceType
    ? InstanceType
    : any
// 用 ConstructorType 匹配一个模式类型，提取返回的实例类型到 infer 声明的局部变量 InstanceType 里，返回 InstanceType。
type Res12 = GetInstanceType<PersonConstructor> // Person

// 4.2 GetConstructorParameters - 提取构造器的参数类型
type GetConstructorParameters<
  ConstructorType extends new (...args: any) => any
> = ConstructorType extends new (...args: infer ParametersType) => any
  ? ParametersType
  : never
type Res13 = GetConstructorParameters<PersonConstructor> // [name: string]

// 5. 索引类型
// 5.1 GetRefProps - 提取 Props 中 ref 的类型
type GetRefProps<Props> = 'ref' extends keyof Props
  ? Props extends { ref?: infer Value | undefined }
    ? Value
    : never
  : never
type Res14 = GetRefProps<{ ref: string }> // string
