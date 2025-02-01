import { render } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { LikeButton } from "../components/LikeButton";

describe("LikeButton", () => {
	test("click twice", async () => {
		const mockOnClick = vi.fn();
		const { container } = render(<LikeButton onClick={mockOnClick} />);

		const user = userEvent.setup();
		const likeButton = container.querySelector("#like-button");
		expect(likeButton).toBeDefined();

		await user.click(likeButton);
		expect(mockOnClick.mock.calls).toHaveLength(1);

		await user.click(likeButton);
		expect(mockOnClick.mock.calls).toHaveLength(2);
	});
});
