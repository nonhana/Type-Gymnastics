// TS 的类型体操的主要技巧主要基于：
// 1. 提取
// 2. 构造
// 3. 递归
// 4. 使用数组长度进行计数
// 5. 联合类型分散

// 还有一些特殊的类型特性
// 1. any, never, 联合类型
// 2. 在 class 中有 public, protected, private 等
// 3. 索引类型有具体的索引和可索引签名，索引有可选和非可选

// 1. IsAny - 判断一个类型是否为 any
// any 与任何的类型交叉后都是 any，也就是 1 & any 结果也是 any
type IsAny<T> = 'non_hana' extends 'hana' & T ? true : false
type Res1 = IsAny<any>

// any 在条件类型中比较特殊，如果参数类型为 any，会直接返回 trueType 和 falseType 的合并
type TestAny<T> = T extends number ? 1 : 2
type TestRes = TestAny<any>

// 2. IsEqual - 判断两个类型是否相等
// 2.1 第一种写法，无法单独判断 any 的类型是否相等
type IsEqual<A, B> = (A extends B ? true : false) & (B extends A ? true : false)
type Res2 = IsEqual<'a', any>

// 2.2 第二种写法，可以正确判断 any 的情况
type IsEqual2<A, B> = (<T>() => T extends A ? 1 : 2) extends <
  T
>() => T extends B ? 1 : 2
  ? true
  : false
type Res3 = IsEqual2<'a', any>

// 3. IsUnion - 判断一个类型是否是联合类型
type IsUnion<A, B = A> = A extends A ? ([B] extends [A] ? false : true) : never

// 4. IsNever - 判断一个类型是否为 never
type IsNever<T> = [T] extends [never] ? true : false

// 5. IsTuple - 判断一个类型是否是元组
// NotEqual 的实现就是 IsEqual2 反了一下
type NotEqual<A, B> = (<T>() => T extends A ? 1 : 2) extends <
  T
>() => T extends B ? 1 : 2
  ? false
  : true
type IsTuple<T> = T extends [...infer Rest]
  ? NotEqual<Rest['length'], number>
  : false
type Res4 = IsTuple<[1, 2, 3]>

// 6. UnionToIntersection - 将联合类型转换为交叉类型
// 类型之间是有父子关系的，更具体的那个是子类型
// 比如 A & B 是 A | B 的子类型
// 如果允许夫类型赋值给子类型，这个行为叫做 逆变
// 如果允许子类型赋值给父类型，这个行为叫做 协变

// TS 的函数参数有逆变的性质，也就是说参数可能是多个类型，参数类型会转变为它们的交叉类型

type UnionToIntersection<U> = (
  U extends U ? (x: U) => unknown : never
) extends (x: infer R) => unknown
  ? R
  : never
type Res5 = UnionToIntersection<{ a: 1 } | { b: 2 }>

// 7. GetOptional - 提取索引类型中的可选索引
// 可选索引的值为 undefined 和值类型的联合类型
// {} extends Pick<Obj, Key> ? Key : never
// 上面这行代码的作用是判断 {} 是否是从 Obj 中单独取出 Key 索引后的新对象类型 Res 的子类型
// 因为如果 Key 为可选索引，那么 Res 是只有一个可选索引的对象类型，可选自然包含啥都没有的情况
type GetOptional<Obj extends Record<string, any>> = {
  [Key in keyof Obj as {} extends Pick<Obj, Key> ? Key : never]: Obj[Key]
}

// 8. GetRequired - 提取索引类型中的必选索引
// 原理和 GetOptional 相反
type GetRequired<Obj extends Record<string, any>> = {
  [Key in keyof Obj as {} extends Pick<Obj, Key> ? never : Key]: Obj[Key]
}

// 9. RemoveIndexSignature - 移除索引签名
type Obj = {
  sleep(): void
  [key: string]: any
}
// 索引签名不能构造成字符串字面量类型，因为它没有名字，而其他的索引可以
type RemoveIndexSignature<Obj extends Record<string, any>> = {
  [Key in keyof Obj as Key extends `${infer Str}` ? Str : never]: Obj[Key]
}
type Res6 = RemoveIndexSignature<Obj>

// 10. ClassPublicProps - 过滤出 Class 中的 public 属性
// keyof 只能拿到 class 的 public 索引，private 和 protected 是拿不到的
class NonHana {
  public name: string
  private age: number
  protected hobbies: string[]

  constructor() {
    this.name = 'non_hana'
    this.age = 18
    this.hobbies = ['lappland']
  }
}
type ClassPublicProps<Obj extends Record<string, any>> = {
  [Key in keyof Obj]: Obj[Key]
}
type Res7 = ClassPublicProps<NonHana>

// 11. as const - 能够将一些对象、数组的类型推导为只读的精确字面量类型
// 不是用在类型上的，是用在具体的某个 JS 对象、数组上的
const obj = {
  a: 1,
  b: 2,
} as const
type objType = typeof obj

const arr = [1, 2, 3] as const
type arrType = typeof arr
