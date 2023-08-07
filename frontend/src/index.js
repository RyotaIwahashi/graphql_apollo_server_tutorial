import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'

import { ApolloClient, ApolloProvider, InMemoryCache, gql } from '@apollo/client'

// 指定された URI とキャッシュを使用して新しい ApolloClient インスタンスを作成します。
// uri は、クライアントがクエリとミューテーションを送信するために使用する GraphQL サーバーを指します。
// キャッシュは、これらのクエリと変更の結果を保存するために使用されます。
// https://www.apollographql.com/docs/react/get-started/#create-a-client
const client = new ApolloClient({
  uri: 'http://localhost:4000',
  cache: new InMemoryCache(),
})

// この GraphQL クエリは、名前、電話番号、住所、ID を持つすべての人物を取得します。
// クエリは、@apollo/client パッケージの gql テンプレート リテラル タグを使用して定義されます。
const query = gql`
  query {
    allPersons  {
      name,
      phone,
      address {
        street,
        city
      }
      id
    }
  }
`

// クエリは client.query メソッドで使用され、GraphQL サーバーからデータを取得します。
client.query({ query })
  .then((response) => {
    console.log(response.data)
  })

// <ApolloProvider> コンポーネントは、Apollo GraphQL クライアントを全てのコンポーネントに提供するために使用されています。
ReactDOM.createRoot(document.getElementById('root')).render(
  <ApolloProvider client={client}>
    <App />
  </ApolloProvider>
)
