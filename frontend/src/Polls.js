import { useEffect, useState } from "react";
import { Link } from "react-router-dom";


const Polls = () => {
  const [pollListState, setPollListState] = useState([]);

  useEffect(() => {
    fetch('http://192.168.9.203:3001/api/poll')
      .then(response => response.json())
      .then(data => setPollListState(data))
      .catch(err => console.log(err));
  }, []);

  return (
    <div className="grid place-items-center mt-20">
      <div>
        <span className="text-3xl font-bold">Poll list</span>
      </div>
      <div className="mt-10">
        <ul>
          { pollListState.map(poll => {
            return (
              <Link to={`/vote/${poll.id}`} key={poll.id}>
                <li className="border-2 p-5 shadow-md font-bold mt-5 cursor-pointer hover:scale-110">
                  {poll.name}
                </li>
              </Link>
            )
          }) }
        </ul>
      </div>
    </div>
  );
}

export default Polls;
