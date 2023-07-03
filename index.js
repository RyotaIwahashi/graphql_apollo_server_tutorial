// GraphQL
// ブラウザ上のコードが必要なデータを記述するクエリを形成し、それを HTTP POST リクエストで GraphQL の API に送信する。
// REST のリソースベースとは異なり、すべての GraphQL クエリは同じアドレスに送信され、そのタイプは POST になる。
// node index.js で実行したら、http://localhost:4000 でQueryを実行できる。

const { ApolloServer } = require('@apollo/server')
const { startStandaloneServer } = require('@apollo/server/standalone')

const { v1: uuid } = require('uuid')

// GraphQL は実際にはデータベースとは何の関係もない。
// つまり、データがどのように保存されているかは関係なく、
// GraphQL API が使用するデータは、RDB、ドキュメント データベース、
// または GraphQL サーバーが REST などでアクセスできる他のサーバーに保存できる。
// 以下は例として、DBなどから取得したデータをpersonsに格納しているとしてデモする。
let persons = [
  {
    name: "Arto Hellas",
    phone: "040-123543",
    street: "Tapiolankatu 5 A",
    city: "Espoo",
    id: "3d594650-3436-11e9-bc57-8b80ba54c431"
  },
  {
    name: "Matti Luukkainen",
    phone: "040-432342",
    street: "Malminkaari 10 A",
    city: "Helsinki",
    id: '3d599470-3436-11e9-bc57-8b80ba54c431'
  },
  {
    name: "Venla Ruuska",
    street: "Nallemäentie 22 C",
    city: "Helsinki",
    id: '3d599471-3436-11e9-bc57-8b80ba54c431'
  },
]

// type person は、person に5つのフィールドがあり、フィールドのうち4つはString型で、GraphQL のスカラー型の1つ。
// 感嘆符は、Queryの返答として必須項目であることを示す。
// type Query は、GraphQLサーバ(API) に対してどのような種類のクエリを実行できるかを示す。
const typeDefs = `
  type Address {
    street: String!
    city: String!
  }

  type Person {
    name: String!
    phone: String
    address: Address!
    id: ID!
  }

  type Query {
    personCount: Int!
    allPersons: [Person!]!
    findPerson(name: String!): Person
  }

  type Mutation {
    addPerson(
      name: String!
      phone: String
      street: String!
      city: String!
    ): Person
  }
`
// mutation は、データに対して変更を引き起こすすべての操作を定義する
// addPerson(): Person で、戻り値が Person 型であることを示している。

// GraphQL クエリは、サーバーとクライアントの間で移動するデータのみを記述する。
// すべてのリゾルバーは、次の 4 つの位置引数が与えられる。
// それぞれの引数について https://the-guild.dev/graphql/tools/docs/resolvers#resolver-function-signature
const resolvers = {
  Query: {
    personCount: () => persons.length,
    allPersons: () => persons,
    findPerson: (obj, args) => 
      persons.find(p => p.name === args.name)
  },
  // 以下はデフォルトで含まれており、ユーザが定義せずとも使用できるリゾルバ。
  // 親フィールドのリゾルバーから返された結果を含む obj から、それぞれの値を取得するリゾルバ。
  // Person: {
  //   name: (obj) => obj.name,
  //   phone: (obj) => obj.phone,
  //   id: (obj) => obj.id
  // }

  // address のように、アドレスフィールドがないものは、デフォルトのリゾルバーでは不十分で、
  // Personタイプのaddressフィールドとしてリゾルバーを追加する必要がある。
  Person: {
    address: (obj) => {
      return {
        street: obj.street,
        city: obj.city
      }
    }
  },

  Mutation: {
    // args の引数や型が typeDefs で定義されている
    addPerson: (obj, args) => {
      const person = { ...args, id: uuid() }
      persons = persons.concat(person)
      return person
    }
  }
}

// Query は例えば以下のようになる。
// このとき、queryに記載される findPerson や phone には、すべてリゾルバが必要。
// query {
//   findPerson(name: "Arto Hellas") {
//     phone 
//     address {
//       city 
//       street
//     }
//   }
// }

// Mutation のクエリ例は以下。
// mutation {
//   addPerson(
//     name: "Pekka Mikkola"
//     phone: "045-2374321"
//     street: "Vilppulantie 25"
//     city: "Helsinki"
//   ) {
//     name
//     phone
//     address{
//       city
//       street
//     }
//     id
//   }
// }

// typeDefs は、GraphQLスキーマが含まれる。
// resolvers は、サーバのリゾルバーで、GraphQLクエリへの応答方法を定義する。
// resolvers に存在する Query は、typeDefs で type Query として定義されている。
const server = new ApolloServer({
  typeDefs,
  resolvers,
})

// node index.js でGraphQLサーバを起動する。
startStandaloneServer(server, {
  listen: { port: 4000 },
}).then(({ url }) => {
  console.log(`Server ready at ${url}`)
})
