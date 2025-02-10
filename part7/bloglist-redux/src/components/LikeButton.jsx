export const LikeButton = ({ id, onClick }) => {
	return (
		<button id={id ? id : "like-button"} onClick={onClick}>
			like
		</button>
	);
};
