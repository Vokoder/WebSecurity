import React from "react"
import Message from "./message"

const Chat = (props) => {
    const msg = [
        {
            id: 1,
            username: "username",
            data: "13.04.2005 13:40",
            edited: false,
            message: "some text",
        },
        {
            id: 2,
            username: "user nickname",
            data: "27.10.2004 5:13",
            edited: true,
            message: "ttteeexxxtttsdfgdfghydfgh dfghuidfghseo88gshgs 87ghsogsdhuighsdg uisrtytvwe78obtywenv78gttteeexxxttts dfgdfghydfghdfghuidfghseo88gshgs87 ghsogsdhuighsdguisrtytvwe78obtywenv78gttteeexxxtttsdfgdfg hydfghdfghuidfghseo88gshgs87ghsogsdhuighsdguisrtytvwe78obtyw env78gttteeexxxtttsdfgdfghydfghdfghuidfghseo88gshgs87ghsogsdhui fgdgsdgdfshdgsdzghjyfghfhdgsfgshdjgnfsdhtjgnbvfrthfhjngfbvdfrthfjgnvbcdfsrgthfgbcvsdfghfgfddghfghigushervteroisuvgnhser8buigebshdvguiesdhvgndsfyuigvhnsrbt87seruivghni ghsdguisrtytvwe78obtywenv78gttteeexxxtttsdfgdfghydfghdfghuidfghseo88gshgs87ghsogsdhuighsdguisrtytvwe78obtywenv78gttteeexxxtttsdfgdfghydfghdfghuidfghseo88gshgs87ghsogsdhuighsdguisrtytvwe78obtywenv78gttteeexxxtttsdfgdfghydfghdfghuidfghseo88gshgs87ghsogsdhuighsdguisrtytvwe78obtywenv78gttteeexxxtttsdfgdfghydfghdfghuidfghseo88gshgs87ghsogsdhuighsdguisrtytvwe78obtywenv78gttteeexxxtttsdfgdfghydfghdfghuidfghseo88gshgs87ghsogsdhuighsdguisrtytvwe78obtywenv78gttteeexxxtttsdfgdfghydfghdfghuidfghseo8 8gshgs87ghsogsdhuighsdguisrtytvwe78obtywenv78gttteeexxxtttsdfgdfghydfghdfghuidfghseo88gshgs87ghsogsdhuighsdguisrtytvwe78obtywenv78gttteeex xxtttsdfgdfghydfghdfghuidfghseo88gshgs87ghsogsdhuighsdguisrtytvwe78obtywenv78g",
        },
    ]

    return <div className={props.className}><Message message={msg[0]} username={props.username} /><Message message={msg[1]} username={props.username} /></div>
}

export default Chat