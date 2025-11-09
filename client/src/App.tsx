import type {Wobble} from "../../shared/src/types/index"
import './App.css'

function App() {
  var Pedro:Wobble = {
    name:'Pedro',
    age: 24
  }
  console.log(JSON.stringify(Pedro))
  return (
    <>
      <div>
        <h1>Hello There</h1>
      </div>
    </>
  )
}

export default App
