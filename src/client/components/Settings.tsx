import React from "react";
import BackArrow from "../assets/backarrow.png";

export const Settings = () => {
  const [isOpen, setIsOpen] = React.useState(false);
  return (
    <>
      <button onClick={() => setIsOpen(true)}>Settings</button>
      {isOpen && (
        <div style={{
        backgroundColor: "#FAF7ED",
        border: "2px solid black",
        borderRadius: 5,
        width: 400,
        fontFamily: "Sans-Serif",}}>
          <div style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            padding: "10px 0 10px 0",
            borderBottom: "2px solid black",
            }}>
          <h1 style={{fontSize: 24,}}>Settings</h1>
          </div>
            <div style={{
              backgroundColor: "#9CADD8",
              padding: 10,
              borderRadius: 1,
            }}>
              <button onClick={() => setIsOpen(false)} style={{
                top: 10,
                right: 10,
            }}><img src={BackArrow} alt="Close" width={25} height={25}/></button>
            <p style={{
              justifySelf:"center",
              fontWeight: "bold",
              fontSize: 18,
              marginBottom: 10,
            }}>Notification Settings</p>
            <p>Event Reminders</p>
            <input type="checkbox" style={{
              marginLeft: 10,
              backgroundColor: "white",
            }}></input>
            <p>
              Interested Notifications
            </p>
            <input type="checkbox" style={{
              marginLeft: 10,
              backgroundColor: "white",}}></input>
              <br></br>
            <button style={{
              marginTop: 10,
              backgroundColor: "#BAC67A",
              marginLeft: 280,
              padding: "5px 15px",
              borderRadius: 5,
            }}>Apply</button>
          </div>
        </div>
      )}
    </>
  );
};
