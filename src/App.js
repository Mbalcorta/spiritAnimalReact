import React, { Component } from 'react';
import { auth, database } from './firebase';
import UserInfo from './UserInfo';
import SignIn from './SignIn';
import pick from 'lodash/pick';

class App extends Component {
  constructor(props) {
    super(props);
    this.usersRef = null;
    this.userRef = null;
    this.state = {
      user: null,
      users: {}
    };
  }

  componentWillMount() {
    auth.onAuthStateChanged((user) => {
      this.setState({ user });
      this.usersRef = database.ref('users');
      this.userRef = this.usersRef.child(user.uid);

      this.userRef.once('value').then((snapshot) => {
        if (snapshot.val()) return;
        const userInfo = pick(user, ['displayName', 'photoURL', 'email']);
        this.userRef.set(userInfo);
      });

      this.usersRef.on('value', (snapshot) => {
        this.setState({ users: snapshot.val() });
      });
    });
  }

  render() {
    const { user } = this.state;

    return (
      <div className="App">
        <header className="App--header">
          <h1>Social Animals</h1>
        </header>
        { user
          ? <div>
              <UserInfo user={user} />
            </div>
          : <SignIn />
        }
      </div>
    );
  }
}

export default App;