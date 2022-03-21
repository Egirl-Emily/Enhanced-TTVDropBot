import {userdata} from "../data/userdata";

const TwitchGQL = require("@zaarrg/twitch-gql-ttvdropbot").Init();

export async function findLiveChannel(allowedChannels:Array<Channel>) {

    let foundlivechannel = [];

    if (allowedChannels !== null) {
        AllowedCHloop:
            for (const AllowedChannelElement of allowedChannels) {
                if (await TwitchGQL.GetLiveStatus(AllowedChannelElement.displayName)) {

                    let TagList = await TwitchGQL._SendQuery("RealtimeStreamTagList", {channelLogin: AllowedChannelElement.displayName}, '9d952e4aacd4f8bb9f159bd4d5886d72c398007249a8b09e604a651fc2f8ac17', 'OAuth ' + userdata.auth_token, true)
                    let Tags:Array<Tag> = TagList[0].data.user.stream.tags

                    TagLoop:
                        for (const Tagelement of Tags) {
                            if (Tagelement.id === 'c2542d6d-cd10-4532-919b-3d19f30a768b') {
                                foundlivechannel.push(AllowedChannelElement.displayName)
                                break AllowedCHloop;
                            }
                        }
                }
            }
    } else {
        //Find Drop Channel via Tag
        let opts = {
            limit: 50,
            options: {
                sort: "VIEWER_COUNT",
                tags: ["c2542d6d-cd10-4532-919b-3d19f30a768b"]
            },
            sortTypeIsRecency: false
        }
        const directorypagegame = await TwitchGQL.GetDirectoryPageGame(userdata.game, opts)
        foundlivechannel.push(directorypagegame[0].data.game.streams.edges[0].node.broadcaster.displayName)
    }

    return foundlivechannel
}

type Channel = {
    id: string,
    displayName: string,
    name: string,
    __typename: string
}

type Tag = {
    id: string,
    isLanguageTag: boolean,
    localizedName: string,
    tagName: string,
    __typename: string,
    scope: string
}


