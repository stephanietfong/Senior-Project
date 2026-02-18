import { SignUpBox } from "../components/SignUpBox";
import "../Interests.css";

export const InterestsPage = () => {
  return (
    <div className="sign-up-box">
      <SignUpBox>
        <h1 className="interests-title">Tell us what interests you so we can curate a better experience.</h1>
        <h2 className="interests-subheader">Please choose at least three</h2>
        <div>
          <div className="row">
            <button className="interest-button">Food</button>
            <button className="interest-button">Art</button>
          </div>
          <div className="row">
            <button className="interest-button">House Parties</button>
            <button className="interest-button">Clubs</button>
          </div>
          <div className="row">
            <button className="interest-button">Career Events</button>
            <button className="interest-button">Theater</button>
          </div>
          <div className="row">
            <button className="interest-button">21+ Drinks</button>
            <button className="interest-button">Comm. Mtgs.</button>
          </div>
          <div className="row">
            <button className="interest-button">Shopping</button>
            <button className="interest-button">Miscellaneous</button>
          </div>
          <div className="row">
          <button className="submit-button">Continue</button>
          </div>
        </div>
      </SignUpBox>
    </div>
  );
};