import { useEffect, useState } from "react";
import axios from "axios";
import { useGetUserID } from "../hooks/useGetUserID.js";
import { useCookies } from "react-cookie";

export const Home = () => {
  const [recipes, setRecipes] = useState([]);
  const [savedRecipes, setSavedRecipes] = useState([]);
  const [cookies, _] = useCookies(["access_token"]);

  const userID = useGetUserID();
  useEffect(() => {
    const fetchRecipe = async () => {
      try {
        const response = await axios.get("http://localhost:3001/recipes");
        setRecipes(response.data);
      } catch (error) {
        console.log(error);
      }
    };

    const fetchSavedRecipe = async () => {
      try {
        const response = await axios.get(
          `http://localhost:3001/recipes/savedRecipes/ids/${userID}`
        );
        setSavedRecipes(response.data.savedRecipes);
      } catch (error) {
        console.log(error);
      }
    };
    fetchRecipe();
    if (cookies.access_token) fetchSavedRecipe();
  }, []);

  const saveRecipe = async (recipeID) => {
    try {
      const response = await axios.put(
        "http://localhost:3001/recipes",
        {
          recipeID,
          userID,
        },
        { headers: { authorization: cookies.access_token } }
      );
      setSavedRecipes(response.data.savedRecipes);
    } catch (error) {
      console.log(error);
    }
  };

  const isRecipeSaved = (id) => savedRecipes.includes(id);

  return (
    <div>
      <h2>Recipes</h2>
      <ul>
        {recipes.map((recipe) => (
          <li key={recipe._id}>
            {savedRecipes.includes(recipe._id) && <h1>Already Saved</h1>}
            <div>
              <h2>{recipe.name}</h2>
              <button
                onClick={() => saveRecipe(recipe._id)}
                disabled={isRecipeSaved(recipe._id)}
              >
                {isRecipeSaved(recipe._id) ? "Saved" : "Save"}
              </button>
            </div>

            <div className="instructions">
              <p>{recipe.instructions}</p>
            </div>

            <img src={recipe.imageUrl} alt={recipe.name} />

            <p>Cooking Time: {recipe.cookingTime} (min) </p>
          </li>
        ))}
      </ul>
    </div>
  );
};
