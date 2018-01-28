import React, { Component, PropTypes } from 'react';
import FileInput from 'react-file-input';
import { storage, database } from './firebase';
import './ProfileCard.css';

class ProfileCard extends Component {
  constructor(props) {
    super(props);

    this.state = {
      uploadProgress: null
    };

    this.userRef = database.ref('users').child(props.uid);
    this.storageRef = storage.ref('user-images').child(props.uid);

    this.handleFileUpload = this.handleFileUpload.bind(this);
    this.handleFileRemoval = this.handleFileRemoval.bind(this);
  }

  handleFileUpload(event) {
    const file = event.target.files[0];
    const uploadTask = this.storageRef.child(file.name)
                                      .put(file, { contentType: file.type });

    uploadTask.on('state_changed', (snapshot) => {
      const uploadProgress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
      this.setState({ uploadProgress });
    });

    uploadTask.then((snapshot) => {
      this.userRef.update({
        imageURL: snapshot.downloadURL,
        imageName: file.name
      });
      this.setState({ uploadProgress: null });
    });
  }

  handleFileRemoval() {
    const { imageName } = this.props;
    this.storageRef.child(imageName).delete().then(() => {
      this.userRef.update({
        imageURL: null,
        imageName: null
      });
    });
  }

  render() {
    const { photoURL, displayName, email, imageURL, imageName } = this.props;
    const { uploadProgress } = this.state;

    return (
      <article className="ProfileCard">
        {
          uploadProgress &&
          <div>
            <strong>Uploading</strong>: { Math.round(uploadProgress) }%
          </div>
        }
        <img
          className="ProfileCard--photo"
          src={ imageURL || photoURL }
          alt={ displayName }
        />
        <div className="ProfileCard--identification">
          <h3 className="ProfileCard--displayName">{ displayName }</h3>
          <p className="ProfileCard--email">{ email }</p>
          <FileInput name="ProfileCard--fileinput"
                     accept=".png,.gif,.jpg"
                     placeholder={imageName || "Spirit Animal Image"}
                     className="ProfileCard--upload"
                     onChange={this.handleFileUpload} />
          { imageName && <button onClick={this.handleFileRemoval}>Delete Image</button> }
        </div>
      </article>
    );
  }
}

ProfileCard.propTypes = {
  displayName: PropTypes.string.isRequired,
  email: PropTypes.string.isRequired,
  imageName: PropTypes.string,
  imageURL: PropTypes.string,
  photoURL: PropTypes.string.isRequired,
  uid: PropTypes.string.isRequired
};

export default ProfileCard;
