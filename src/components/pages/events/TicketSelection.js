import React from "react";
import PropTypes from "prop-types";
import { withStyles } from "@material-ui/core/styles";
import Grid from "@material-ui/core/Grid";
import { Typography } from "@material-ui/core";
import InputGroup from "../../common/form/InputGroup";

const styles = theme => ({
	container: {
		marginTop: theme.spacing.unit * 4,
		marginBottom: theme.spacing.unit * 4
	}
});

const TicketSelection = props => {
	const {
		available,
		classes,
		error,
		name,
		description,
		price,
		amount,
		increment,
		onNumberChange,
		validateFields
	} = props;

	const incrementText =
		increment > 1 ? `(Tickets must be bought in groups of ${increment})` : "";

	return (
		<Grid alignItems="center" className={classes.container} container>
			<Grid item xs={8} sm={8} md={6} lg={8}>
				<Typography variant="subheading">{name}</Typography>
				<Typography variant="caption">
					{description} {incrementText}
				</Typography>
			</Grid>
			<Grid item xs={2} sm={2} md={6} lg={2}>
				<Typography variant="title">{available ? `$${price}` : ""}</Typography>
			</Grid>
			<Grid item xs={2} sm={2} md={6} lg={2} style={{ paddingTop: 10 }}>
				<InputGroup
					autoComplete="off"
					disabled={!available}
					error={error}
					value={amount || ""}
					name="amount"
					type="number"
					onChange={e => {
						onNumberChange(Number(e.target.value));
					}}
					placeholder="0"
					onBlur={validateFields}
				/>
			</Grid>
		</Grid>
	);
};

TicketSelection.propTypes = {
	available: PropTypes.bool,
	onNumberChange: PropTypes.func.isRequired,
	name: PropTypes.string.isRequired,
	description: PropTypes.string.isRequired,
	price: PropTypes.number.isRequired,
	error: PropTypes.string,
	amount: PropTypes.number,
	increment: PropTypes.number.isRequired,
	validateFields: PropTypes.func.isRequired,
	classes: PropTypes.object.isRequired
};

export default withStyles(styles)(TicketSelection);
