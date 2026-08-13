import type { Meta, StoryObj } from "@storybook/react-vite";

import { MovieCard } from "./MovieCard";
import { mockResponse } from "@/test/mockResponse";

const movie = mockResponse.results[0];

const meta = {
  title: "Components/MovieCard",
  component: MovieCard,
  decorators: [
    (StoryComponent) => (
      <div className="p-4 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-5">
        <StoryComponent />
      </div>
    ),
  ],
} satisfies Meta<typeof MovieCard>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: movie,
};

export const LongTitle: Story = {
  args: {
    ...movie,
    original_title:
      "Batman Returns With An Extremely Long Movie Title That Should Wrap Nicely",
  },
};
