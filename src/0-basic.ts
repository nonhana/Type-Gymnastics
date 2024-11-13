// TS 的类型系统的类型运算

// 1. 条件：extends ? :
// 类似于 if else 语句，根据 extends 后的条件判断结果返回不同的类型
type res = 1 extends 2 ? 'yes' : 'no' // 'no'
type res2<T> = T extends number ? true : false

type T1 = res2<number> // true

// 2. 推导：infer
// infer 主要用于提取类型的一部分，通常与 extends 结合使用

// 提取元组类型的第一个元素
type First<Tuple extends unknown[]> = Tuple extends [infer T, ...infer R]
  ? T
  : never

type T2 = First<[1, 2, 3]> // 1

// 3. 联合：|
type Union = string | number | boolean

// 4. 交叉：&
// 只能够合并相同类型的属性
type Intersection = { a: string } & { b: number }
type T3 = { a: string; b: number } extends Intersection ? true : false // true

// 5. 映射类型
// 相当于把一个集合映射到另一个集合
type ObjType1 = {
  a: number
  b: string
  c: boolean
}

type MapTypeValue<T> = {
  [key in keyof T]?: T[key]
}
// keyof T 是查询索引类型中所有的索引，叫做索引查询
// T[key] 是取索引类型某个索引的值，叫做索引访问
// in 是用于遍历联合类型的运算符
type T4 = MapTypeValue<ObjType1>

// keyof T 取出来的索引是 string | number | symbol
// 和 & string 取交叉部分，能够只得到 string
// 这里的 as 运算符能够把 key 进行重映射
type MapTypeKey<T> = {
  [key in keyof T as `${key & string}${key & string}${key & string}`]: [
    T[key],
    T[key],
    T[key]
  ]
}
type T5 = MapTypeKey<ObjType1>
