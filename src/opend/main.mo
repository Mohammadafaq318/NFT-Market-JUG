import Principal "mo:base/Principal";
import NFTActorClass "../NFT/nft";
import Cycles "mo:base/ExperimentalCycles";
import Debug "mo:base/Debug";
import HashMap "mo:base/HashMap";
import List "mo:base/List";


actor OpenD {
    
    var mapOfNFTs = HashMap.HashMap<Principal,NFTActorClass.NFT>(1,Principal.equal,Principal.hash);
    var mapOfOwners = HashMap.HashMap<Principal,List.List<Principal>>(1,Principal.equal,Principal.hash);

    
    public shared(msg) func mint(imgData: [Nat8], name: Text) : async Principal{
        let owner : Principal = msg.caller;
        
        Cycles.add(100_500_000_000);
        let newNFT = await NFTActorClass.NFT(name,owner,imgData);
        let newNFTPrincipal : Principal = await newNFT.getCanisterId();

        mapOfNFTs.put(newNFTPrincipal,newNFT);
        addToOwnershipMap(owner,newNFTPrincipal);
        return newNFTPrincipal;
    };


    private func addToOwnershipMap(owner: Principal, nftId: Principal){
        var ownedNFTS : List.List<Principal> = switch (mapOfOwners.get(owner)){
            case null List.nil<Principal>();
            case (?result) result;
        };

        ownedNFTS:= List.push(nftId,ownedNFTS);
        mapOfOwners.put(owner,ownedNFTS);
    };

    public query func getOwnedNFTs(user:Principal):async [Principal]{
        var userNFTS : List.List<Principal> = switch (mapOfOwners.get(user)){
            case null List.nil<Principal>();
            case (?result) result;
        };

        return List.toArray(userNFTS);
    };
};
