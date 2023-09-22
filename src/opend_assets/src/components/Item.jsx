import React, { useEffect, useState } from "react";
import logo from "../../assets/logo.png";
import {Actor, HttpAgent} from "@dfinity/agent";
import { idlFactory } from "../../../declarations/nft/index";
import {Principal} from "@dfinity/principal";

function Item(props) {

  const [name,setName] = useState();
  const [owner,setowner] = useState();
  const [asset,setasset] = useState();

  const id=props.id;
  const localHost="http://localhost:8080/";
  const agent = new HttpAgent({host:localHost});


  async function loadNFT(){
    const NFTActor = await Actor.createActor(idlFactory,{
      agent,
      canisterId: id
    });

    const nftname = await NFTActor.getName();
    const nftowner = await NFTActor.getOwner();
    const nftasset = await NFTActor.getAsset();
    const imageContent = new Uint8Array(nftasset);
    const image = URL.createObjectURL(new Blob([imageContent.buffer],{
      type: "image/png"
    }));

    setName(nftname);
    setowner(nftowner.toText());
    setasset(image);
  };
  

  useEffect(()=>{
    loadNFT();
  },[]);


  return (
    <div className="disGrid-item">
      <div className="disPaper-root disCard-root makeStyles-root-17 disPaper-elevation1 disPaper-rounded">
        <img
          className="disCardMedia-root makeStyles-image-19 disCardMedia-media disCardMedia-img"
          src={asset}
        />
        <div className="disCardContent-root">
          <h2 className="disTypography-root makeStyles-bodyText-24 disTypography-h5 disTypography-gutterBottom">
            {name}<span className="purple-text"></span>
          </h2>
          <p className="disTypography-root makeStyles-bodyText-24 disTypography-body2 disTypography-colorTextSecondary">
            Owner: {owner}
          </p>
        </div>
      </div>
    </div>
  );
}

export default Item;
