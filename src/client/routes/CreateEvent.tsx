import React from "react";
import { Settings } from "../components/Settings";
import { Link } from "react-router-dom";

export const CreateEventPage = () => {
    // list of tags
    // TODO: make this a global const
    const tags = ["Music", "Food", "Sports", "Art", "Tech", "Outdoors", "House Party", "Study Group", "Networking", "Gaming", "Fitness", "Volunteering", "21+ Drinks",
         "Theater", "Miscellaneous", "Shopping", "Comm. Mtgs." ];
    const styles = `
    .create-event-page {
      color: black;
      font-family: Sans-Serif;
    }

    .create-event-page h1 {
      font-size: 24px;
      font-weight: bold;
      text-align: center;
      margin-top: 40px;
    }

    .create-event-page h2 {
      font-size: 18px;
    }
    `;
  return (
    <>
    <style>{styles}</style>
    <div className="create-event-page">
        {/* <Link to="/"><button>Back</button></Link> */}
        <div style={{ padding: 20 }}>
            <h1 style={{marginTop:0}}>Basic Info</h1>
            <div style={{ display: "flex", flexDirection: "column", gap: 10, marginTop: 20 }}>
                <h2>Event Title</h2>
                <input type="text" style={{
                    backgroundColor: "lightgray",
                    borderRadius: "5px",
                    width: "40%",
                }}/>
                <h2>Event Summnary</h2>
                <input type="text" style={{
                    backgroundColor: "lightgray",
                    borderRadius: "5px",
                    width: "40%",
                    height: 100,
                }}/>
                <h2>Tags</h2>
                <div style={{display: "flex", gap: 10, flexWrap: "wrap"}}>
                    {tags.map((tag) => (
                        <button key={tag} style={{
                            border: "1.5px solid black",
                            borderRadius: "5px",
                            padding: "10px 30px",
                        }}>{tag}</button>
                    ))}
                </div>
            </div>
            <h1>Date & Time</h1>
            <div style={{
                display: "flex",
                flexDirection: "row",
                justifyContent: "space-evenly",
            }}>
                <div>
                    <p style={{
                        textAlign: "center",
                        marginBottom: "5px",
                    }}>Start Time</p>
                    <input type="datetime-local" style={{
                        backgroundColor: "lightgray",
                        borderRadius: "5px",
                        padding: "5px",
                    }}/>
                </div>
                <div>
                    <p style={{
                        textAlign: "center",
                        marginBottom: "5px",
                    }}>End Time</p>
                    <input type="datetime-local" style={{
                        backgroundColor: "lightgray",
                        borderRadius: "5px",
                        padding: "5px",
                    }}/>
                </div>
            </div>
            <div>
                <h1>Location</h1>
                <h2>Location Name</h2>
                <input type="text" style={{
                    backgroundColor: "lightgray",
                    borderRadius: "5px",
                    width: "40%",
                    margin: "10px 0",
                }}/>
                <h2>Location Address</h2>
                <input type="text" style={{
                    backgroundColor: "lightgray",
                    borderRadius: "5px",
                    width: "40%",
                    marginTop: 10,
                }}/>
                <h1>Details</h1>
                <h2>Description</h2>
                <input type="text" style={{
                    backgroundColor: "lightgray",
                    borderRadius: "5px",
                    width: "40%",
                    height: 100,
                }}/>
                <h2 style={{ margin: "10px 0" }}>Event Image</h2>
                <input type="file" accept="image/*"/>
                <h2 style={{ margin: "10px 0" }}>Requires  RSVP/Ticket</h2>
                <input type="checkbox" style={{ backgroundColor: "white" }}></input>
                <h2>Capacity</h2>
                <input type="text" style={{
                    backgroundColor: "lightgray",
                    borderRadius: "5px",
                    width: "40%",
                    marginTop: 10,
                }}/>
                <h2 style={{ margin: "10px 0" }}>Is 18+</h2>
                <input type="checkbox"></input>
                <h2 style={{ margin: "10px 0" }}>Is 21+</h2>
                <input type="checkbox"></input>
            </div>
            <div style={{
                display: "flex",
                justifyContent: "space-evenly"
            }}>
                <button style={{
                    backgroundColor: "#BAC67A",
                    padding: "10px 20px",
                    borderRadius: "5px"}}>Cancel</button>
                <button style={{
                    backgroundColor: "#7793C2",
                    padding: "10px 20px",
                    borderRadius: "5px"}}>Create Event</button>
            </div>
        </div>
    </div>
    </>
  );
};