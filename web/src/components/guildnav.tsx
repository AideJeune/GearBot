import {Component, h} from "preact";
import {Link} from "preact-router";

import {GuildListNavState} from "./state";

import Gear from "./gear";

import config from "../config";

export default class GuildNav extends Component<{}, GuildListNavState> {

	constructor(props, state) {
		super(props, state);

		this.setState({
			guilds: [],
			guildsLoaded: false
		});

		//TODO: error handling and dynamic links
		fetch(config.apiUrl+"/api/guilds", {credentials: "include"}).then(r => {
			if (r.status != 200) {
				console.log("Failed to retrieve the guild list!")
				this.setState({
					guildsLoaded: true, 
					guilds: []
				})
			} else {
				r.json().then(data => this.setState({
					guilds: data,
					guildsLoaded: true
				}))
			}
		})
	}

	render() {
		if (!this.state.guildsLoaded) {
			return (<h1>Loading guilds...</h1>)
		} else {
			let selections = [];
			for (let guid in this.state.guilds) {
				let info = this.state.guilds[guid];
				selections.push(
					<div class="guildSelection">
						<Link href={"/dashboard/" + guid} activeClassName={"active"}>
							<Gear size={250} image={info.icon}/>
							<p>{info.name}</p>
						</Link>
					</div>
				)
			}
			return (
				<div class="guild-nav">
					{selections.length > 0 ? selections :
						<div class="noGuildsFoundMessage">No guilds currently avaliable!</div>}
				</div>
			)
		}
	}

}