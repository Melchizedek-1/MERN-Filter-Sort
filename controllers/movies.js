// const movies = require("../data/movies.json");
const Movie = require("../models/Movie");

exports.getMovies = async (req, res, next) => {

    try {
        const page = parseInt(req.query.page) - 1 || 0;
		const limit = parseInt(req.query.limit) || 5;
		const search = req.query.search || "";
		let sort = req.query.sort || "rating";
		let genre = req.query.genre || "All";

		const genreOptions = [
			"Action",
			"Romance",
			"Fantasy",
			"Drama",
			"Crime",
			"Adventure",
			"Thriller",
			"Sci-fi",
			"Music",
			"Family",
		];

		genre === "All"
			? (genre = [...genreOptions])
			: (genre = req.query.genre.split(","));
		req.query.sort ? (sort = req.query.sort.split(",")) : (sort = [sort]);

		let sortBy = {};
		if (sort[1]) {
			sortBy[sort[0]] = sort[1];
		} else {
			sortBy[sort[0]] = "asc";
		}

        const movies = await Movie.find({ name: { $regex: search, $options: "i" } })
			.where("genre")
			.in([...genre])
			.sort(sortBy)
			.skip(page * limit)
			.limit(limit);

		const total = await Movie.countDocuments({
			genre: { $in: [...genre] },
			name: { $regex: search, $options: "i" },
		});

        res.status(201).json({
            success: true,
            total,
            page: page + 1,
			limit,
            movies,
			genres: genreOptions
        });

    } catch (error) {
        console.log(error);
    }
}

// const insertMovies = async () => {
//     try {
//         const docs = await Movie.insertMany(movies);
//         return Promise.resolve(docs);
//     } catch (err) {
//         return Promise.reject(err)
//     }
// };

// insertMovies()
//     .then((docs) => console.log(docs))
//     .catch((err) => console.log(err))