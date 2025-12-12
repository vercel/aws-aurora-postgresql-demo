import { deleteMovies } from "../lib/load-test/db";

(async () => {
  try {
    await deleteMovies();
    console.log("Successfully deleted [LOAD TEST]: tagged movies.");
    process.exit(0);
  } catch (error) {
    console.error("Failed to delete [LOAD TEST]: tagged movies:", error);
    process.exit(1);
  }
})();
