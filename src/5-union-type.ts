// 联合类型是在类型编程中比较特殊的类型，TS 为其做了专门的处理
// 联合分散可简化

// 1. 分布式条件类型
// 当类型参数为联合类型，并且在条件类型左边直接引用该类型时
// TS 会把每一个元素单独传入来进行类型运算，最后再合并为联合类型
// 这种语法叫做分布式条件类型

type Union = 'a' | 'b' | 'c'

type UpperCaseA<Item extends string> = Item extends 'a' ? Uppercase<Item> : Item
// 分别提取，单独计算
type Res1 = UpperCaseA<Union>

// 分别提取，单独计算
type Res2 = `${Union}~~`

// CamelCaseUnion - 对联合类型的所有 Item 进行驼峰化
type CamelCase<Str extends string> =
  Str extends `${infer Left}_${infer Right}${infer Rest}`
    ? `${Left}${Uppercase<Right>}${CamelCase<Rest>}`
    : Str
type CamelCaseArr<Arr extends unknown[]> = Arr extends [
  infer Item,
  ...infer RestArr
]
  ? [CamelCase<Item & string>, ...CamelCaseArr<RestArr>]
  : []

// IsUnion - 判断是否是联合类型
// 条件类型中如果左边的类型是联合类型，会把每个元素单独传入做计算，而右边不会
// 所以如果 A 是联合类型，那么 B 就一直都会是联合类型，会单独遍历 A 中的所有单个类型

// A extends A 主要是为了触发分布式条件类型，让每个类型单独传入进行处理而已
// A extends A 和 [A] extends [A] 是两个不同的处理
// 前者是单个类型和整个类型做判断
// 后者两边都是整个联合类型
// 因为只有 extends 左边直接是类型参数的时候才会触发分布式条件类型
type IsUnion<A, B = A> = A extends A ? ([B] extends [A] ? false : true) : never

// BEM - block__element--modifier - CSS 命名规范
// 数组转联合类型
type ArrToUnion = ['aaa', 'bbb'][number]

type BEM<
  Block extends string,
  Element extends string[],
  Modifiers extends string[]
> = `${Block}__${Element[number]}--${Modifiers[number]}`
type Res3 = BEM<'button', ['header', 'main'], ['active', 'error']>

// AllCombinations - 全组合
type Combination<A extends string, B extends string> =
  | A
  | B
  | `${A}${B}`
  | `${B}${A}`

type AllCombinations<A extends string, B extends string = A> = A extends A
  ? Combination<A, AllCombinations<Exclude<B, A>>>
  : never

type Res4 = AllCombinations<'A' | 'B' | 'C'>
