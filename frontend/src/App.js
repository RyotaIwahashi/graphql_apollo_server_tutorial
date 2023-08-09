import React from 'react'
import { gql, useQuery } from '@apollo/client'
import { Persons } from './components'

// GraphQL クエリを定義する
const ALL_PERSONS = gql`
query {
  allPersons {
    name
    phone
    id
  }
}
`

const App = () => {
  // useQuery フックを使用して、GraphQL クエリを実行する
  const result = useQuery(ALL_PERSONS)

  // データが読み込まれるまで "loading..." を表示する
  if (result.loading) {
    return <div>loading...</div>
  }

  return (
    <div>
      <Persons persons={result.data.allPersons}/>
    </div>
  )
}

export default App
