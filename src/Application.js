import React, { Component } from 'react';
import { auth, database } from './firebase';
import CurrentUser from './CurrentUser';
import SignIn from './SignIn';
import ProfileCard from './ProfileCard';
import pick from 'lodash/pick' ;
import map from 'lodash/map';
import './Application.css';

class App extends Component {
  constructor(props) {
    super(props);
    this.usersRef = null;
    this.userRef = null;
    this.state = {
      user: null,
      users: []
    };
  }

  componentWillMount() {
    auth.onAuthStateChanged((user) => {
      this.setState({ user });
      this.usersRef = database.ref('users');

      if (user) {
        this.userRef = this.usersRef.child(user.uid);

        this.userRef.once('value').then((snapshot) => {
          if (snapshot.val()) return;
          const userInfo = pick(user, ['displayName', 'photoURL', 'email']);
          this.userRef.set(userInfo);
        });
      }

      this.usersRef.on('value', (snapshot) => {
        // this.setState({ users: snapshot.val() });
        this.setState({users: this.state.users.concat([snapshot.val()])});
      });
    });
  }

  render() {
    const { user, users } = this.state;

    return (
      <div className="App">
        <header className="App--header">
          <h1>Social Animals</h1>
        </header>
        { user
          ? <div>
              <section className="UserProfiles">
                {
                  map(users, (profile, uid) => {
                    console.log('profile map ', users, profile);
                    <ProfileCard key={uid[uid]} {...profile[uid]} uid={uid[uid]} user={user[uid]} />
                  })
                }
              </section>
              <CurrentUser user={user} />
            </div>
          : <SignIn />
        }
      </div>
    );
  }
}

export default App;
