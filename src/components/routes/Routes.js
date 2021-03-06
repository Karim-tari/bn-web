import React, { Component } from "react";
import {
	BrowserRouter as Router,
	Route,
	Switch,
	Redirect
} from "react-router-dom";
import { observer } from "mobx-react";

import MuiPickersUtilsProvider from "material-ui-pickers/utils/MuiPickersUtilsProvider";
import MomentUtils from "material-ui-pickers/utils/moment-utils";

import withRoot from "./withRoot";
import Container from "../elements/Container";
import NotFound from "../common/NotFound";
import Dashboard from "../pages/dashboard/Index";
import Account from "../pages/account/Index";
import Artists from "../pages/landing/Artists";
import OrderList from "../pages/orders/List";
import Order from "../pages/orders/Order";
import TicketList from "../pages/tickets/List";
import Signup from "../pages/authentication/Signup";
import Login from "../pages/authentication/Login";
import PasswordReset from "../pages/authentication/PasswordReset";

//Unauthenticated pages
import Home from "../pages/landing/Index";
import ViewEvent from "../pages/events/ViewEvent";
import CheckoutSelection from "../pages/events/CheckoutSelection";
import CheckoutConfirmation from "../pages/events/CheckoutConfirmation";
import CheckoutSuccess from "../pages/events/CheckoutSuccess";

//Admin
import AdminOrganizationsList from "../pages/admin/organizations/List";
import AdminOrganization from "../pages/admin/organizations/Organization";
import AdminVenuesList from "../pages/admin/venues/List";
import AdminVenue from "../pages/admin/venues/Venue";
import AdminArtistsList from "../pages/admin/artists/List";
import AdminArtist from "../pages/admin/artists/Artist";
import AdminEventsList from "../pages/admin/events/List";
import AdminEvent from "../pages/admin/events/Event_old";
import AdminEventUpdate from "../pages/admin/events/EventUpdate";
import AdminEventUpdateOld from "../pages/admin/events/Event_old";

import AdminGuestList from "../pages/admin/events/guests/List";
import AdminEventTicketHolds from "../pages/admin/events/holds/List";

import InviteDecline from "../pages/admin/invites/Decline";
import InviteAccept from "../pages/admin/invites/Accept";

//Embedded widgets
import EventQR from "../widgets/EventQR";
import EmbeddedWidget from "../widgets/Embedded";

import user from "../../stores/user";
import AuthenticateCheckDialog from "../common/AuthenticateCheckDialog";
import WidgetLinkBuilder from "../widgets/LinkBuilder";
import ReceiveTransfer from "../pages/tickets/ReceiveTransfer";

const PrivateRoute = ({ component: Component, isAuthenticated, ...rest }) => {
	//If isAuthenticated is null then we're still checking the state
	return (
		<Route
			{...rest}
			render={props =>
				isAuthenticated === null ? (
					<AuthenticateCheckDialog isLoading={true} />
				) : isAuthenticated === true ? (
					<Component {...props} />
				) : (
					<Redirect to="/login" />
				)
			}
		/>
	);
};

@observer
class Routes extends Component {
	componentDidMount() {
		//Load the google API here because we need the a .env var
		if (!process.env.REACT_APP_GOOGLE_PLACES_API_KEY) {
			if (!process.env.NODE_ENV || process.env.NODE_ENV === "development") {
				console.warn(
					"Please add a REACT_APP_GOOGLE_PLACES_API_KEY value to use google places"
				);
			}
		} else {
			const apiKey = process.env.REACT_APP_GOOGLE_PLACES_API_KEY;
			const script = document.createElement("script");

			script.src = `https://maps.googleapis.com/maps/api/js?key=${apiKey}&libraries=places`;
			document.head.append(script);
		}

		//Check the user details every now and then so we know when a token has expired
		this.interval = setInterval(() => {
			user.refreshUser();
		}, 5 * 60 * 1000); //every 5min
	}

	componentWillUnmount() {
		if (this.interval) {
			clearInterval(this.interval);
		}
	}

	render() {
		const { isAuthenticated } = user;

		return (
			<Router>
				<MuiPickersUtilsProvider utils={MomentUtils}>
					<Container>
						<Switch>
							<Route exact path="/" component={Home} />
							<Route exact path="/events" component={Home} />
							<Route exact path="/artists" component={Artists} />
							<Route exact path="/sign-up" component={Signup} />
							<Route exact path="/login" component={Login} />
							<Route exact path="/password-reset" component={PasswordReset} />
							<Route exact path="/invites/decline" component={InviteDecline} />
							<Route exact path="/invites/accept" component={InviteAccept} />
							<Route
								exact
								path="/tickets/receive"
								component={ReceiveTransfer}
							/>
							<PrivateRoute
								exact
								path="/dashboard"
								component={Dashboard}
								isAuthenticated={isAuthenticated}
							/>
							<PrivateRoute
								exact
								path="/account"
								component={Account}
								isAuthenticated={isAuthenticated}
							/>
							<PrivateRoute
								exact
								path="/tickets"
								component={TicketList}
								isAuthenticated={isAuthenticated}
							/>
							<PrivateRoute
								exact
								path="/orders"
								component={OrderList}
								isAuthenticated={isAuthenticated}
							/>
							<PrivateRoute
								exact
								path="/orders/:id"
								component={Order}
								isAuthenticated={isAuthenticated}
							/>
							<Route exact path="/events/:id" component={ViewEvent} />
							<Route
								exact
								path="/events/:id/tickets"
								component={CheckoutSelection}
							/>
							<Route
								exact
								path="/events/:id/tickets/confirmation"
								component={CheckoutConfirmation}
							/>
							<Route exact path="/cart" component={CheckoutConfirmation} />
							<PrivateRoute
								exact
								path="/events/:id/tickets/success"
								component={CheckoutSuccess}
								isAuthenticated={isAuthenticated}
							/>
							{/* System admin routes TODO hide these if they don't blong */}
							<PrivateRoute
								exact
								path="/admin/dashboard"
								component={Dashboard}
								isAuthenticated={isAuthenticated}
							/>
							<PrivateRoute
								exact
								path="/admin/organizations"
								component={AdminOrganizationsList}
								isAuthenticated={isAuthenticated}
							/>
							<PrivateRoute
								exact
								path="/admin/organizations/create"
								component={AdminOrganization}
								isAuthenticated={isAuthenticated}
							/>
							<PrivateRoute
								exact
								path="/admin/organizations/:id"
								component={AdminOrganization}
								isAuthenticated={isAuthenticated}
							/>
							<PrivateRoute
								exact
								path="/admin/venues"
								component={AdminVenuesList}
								isAuthenticated={isAuthenticated}
							/>
							{/* <Route exact path="/admin/venues" component={AdminVenuesList} /> */}
							<PrivateRoute
								exact
								path="/admin/venues/create"
								component={AdminVenue}
								isAuthenticated={isAuthenticated}
							/>
							<PrivateRoute
								exact
								path="/admin/venues/:id"
								component={AdminVenue}
								isAuthenticated={isAuthenticated}
							/>
							<PrivateRoute
								exact
								path="/admin/artists"
								component={AdminArtistsList}
								isAuthenticated={isAuthenticated}
							/>
							<PrivateRoute
								exact
								path="/admin/artists/create"
								component={AdminArtist}
								isAuthenticated={isAuthenticated}
							/>
							<PrivateRoute
								exact
								path="/admin/artists/:id"
								component={AdminArtist}
								isAuthenticated={isAuthenticated}
							/>
							<PrivateRoute
								exact
								path="/admin/events"
								component={AdminEventsList}
								isAuthenticated={isAuthenticated}
							/>
							<PrivateRoute
								exact
								path="/admin/events/create"
								component={AdminEventUpdate}
								isAuthenticated={isAuthenticated}
							/>
							<PrivateRoute
								exact
								path="/admin/events/:id/edit"
								component={AdminEventUpdate}
								isAuthenticated={isAuthenticated}
							/>
							<PrivateRoute
								exact
								path="/admin/events/:id/edit/old" //TODO remove this when new one is ready
								component={AdminEventUpdateOld}
								isAuthenticated={isAuthenticated}
							/>
							<PrivateRoute
								exact
								path="/admin/events/:id"
								component={AdminEvent}
								isAuthenticated={isAuthenticated}
							/>
							<PrivateRoute
								exact
								path="/admin/events/:id/guests"
								component={AdminGuestList}
								isAuthenticated={isAuthenticated}
							/>
							<PrivateRoute
								exact
								path="/admin/events/:id/holds"
								component={AdminEventTicketHolds}
								isAuthenticated={isAuthenticated}
							/>
							<PrivateRoute
								exact
								path="/admin/widget-builder/:id"
								component={WidgetLinkBuilder}
								isAuthenticated={isAuthenticated}
							/>
							{/* TODO these will be moved into their own Routes.js when web pack is changes to serve different compiled bundles */}
							<Route exact path="/widget/qr/:id" component={EventQR} />
							<Route
								exact
								path="/widget/embed/:id"
								component={EmbeddedWidget}
							/>
							<Route component={NotFound} />
						</Switch>
					</Container>
				</MuiPickersUtilsProvider>
			</Router>
		);
	}
}

Routes.propTypes = {
	//classes: PropTypes.object.isRequired
};

export default withRoot(Routes);
