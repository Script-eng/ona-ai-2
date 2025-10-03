import React from "react";
import one from "../assets/one.jpg";
import two from "../assets/two.jpg";
import three from "../assets/three.jpg";
import four from "../assets/four.jpg";
import five from "../assets/five.jpg";

const avatarConfig = {
  idle: four,        // default smile / neutral
  listening: five,   // listening pose
  processing: two,   // thinking pose
  speaking: one,     // speaking pose
  presenting: three, // presenting pose
};

export default function AvatarBox({ state = "idle" }) {
  const imgSrc = avatarConfig[state] || avatarConfig.idle;
  return (
    <div className="avatar-box">
      <img src={imgSrc} alt={`Ona AI ${state}`} className="avatar-img" />
    </div>
  );
}
