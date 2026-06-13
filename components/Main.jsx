import React from "react"
import IngredientsList from "./IngredientsList"
import ClaudeRecipe from "./ClaudeRecipe"
import { getRecipeFromChefClaude, getRecipeFromHuggingFace } from "../ai"

const hasEnvClaudeKey = !!process.env.ANTHROPIC_API_KEY
const hasEnvHfKey = !!process.env.HF_ACCESS_TOKEN

export default function Main() {
    const [ingredients, setIngredients] = React.useState(
        []
    )
    const [recipe, setRecipe] = React.useState("")
    const recipeSection = React.useRef(null)
    
    const [apiProvider, setApiProvider] = React.useState(() => {
        return localStorage.getItem("apiProvider") || "claude"
    })
    const [claudeApiKey, setClaudeApiKey] = React.useState(() => {
        return localStorage.getItem("claudeApiKey") || ""
    })
    const [hfAccessToken, setHfAccessToken] = React.useState(() => {
        return localStorage.getItem("hfAccessToken") || ""
    })
    const [isSettingsOpen, setIsSettingsOpen] = React.useState(() => {
        const hasSavedClaude = !!localStorage.getItem("claudeApiKey")
        const hasSavedHf = !!localStorage.getItem("hfAccessToken")
        return !hasEnvClaudeKey && !hasEnvHfKey && !hasSavedClaude && !hasSavedHf
    })
    const [showKey, setShowKey] = React.useState(false)
    const [isLoading, setIsLoading] = React.useState(false)
    const [error, setError] = React.useState("")

    React.useEffect(() => {
        if (recipe !== "" && recipeSection.current !== null) {
            const yCoord = recipeSection.current.getBoundingClientRect().top + window.scrollY
            window.scroll({
                top: yCoord,
                behavior: "smooth"
            })
        }
    }, [recipe])

    function handleProviderChange(provider) {
        setApiProvider(provider)
        localStorage.setItem("apiProvider", provider)
        setError("")
    }

    function handleKeyChange(keyType, value) {
        if (keyType === "claudeApiKey") {
            setClaudeApiKey(value)
            localStorage.setItem("claudeApiKey", value)
        } else if (keyType === "hfAccessToken") {
            setHfAccessToken(value)
            localStorage.setItem("hfAccessToken", value)
        }
        setError("")
    }

    async function getRecipe() {
        setIsLoading(true)
        setError("")
        setRecipe("")
        try {
            let recipeMarkdown = ""
            if (apiProvider === "claude") {
                recipeMarkdown = await getRecipeFromChefClaude(ingredients, claudeApiKey)
            } else {
                recipeMarkdown = await getRecipeFromHuggingFace(ingredients, hfAccessToken)
            }
            setRecipe(recipeMarkdown)
        } catch (err) {
            console.error(err)
            setError(err.message || "An error occurred while generating the recipe. Please verify your API key.")
        } finally {
            setIsLoading(false)
        }
    }

    function addIngredient(formData) {
        const newIngredient = formData.get("ingredient")
        if (newIngredient && newIngredient.trim()) {
            setIngredients(prevIngredients => [...prevIngredients, newIngredient.trim()])
        }
    }
    
    return (
        <main>
            <section className="settings-container">
                <div className="settings-header" onClick={() => setIsSettingsOpen(!isSettingsOpen)}>
                    <span className="settings-title">Configure AI Provider</span>
                    <button className="settings-toggle-btn" aria-label="Toggle settings">
                        {isSettingsOpen ? "Hide Settings" : "Show Settings"}
                    </button>
                </div>
                {isSettingsOpen && (
                    <div className="settings-body">
                        <div className="form-group">
                            <label>AI Provider</label>
                            <div className="provider-options">
                                <label className={`provider-option ${apiProvider === "claude" ? "active" : ""}`}>
                                    <input
                                        type="radio"
                                        name="provider"
                                        value="claude"
                                        checked={apiProvider === "claude"}
                                        onChange={() => handleProviderChange("claude")}
                                    />
                                    Claude (Anthropic)
                                </label>
                                <label className={`provider-option ${apiProvider === "huggingface" ? "active" : ""}`}>
                                    <input
                                        type="radio"
                                        name="provider"
                                        value="huggingface"
                                        checked={apiProvider === "huggingface"}
                                        onChange={() => handleProviderChange("huggingface")}
                                    />
                                    Qwen (Hugging Face)
                                </label>
                            </div>
                        </div>

                        {apiProvider === "claude" ? (
                            <div className="form-group">
                                <label htmlFor="claude-key">Anthropic API Key</label>
                                <div className="key-input-container">
                                    <input
                                        id="claude-key"
                                        type={showKey ? "text" : "password"}
                                        placeholder={hasEnvClaudeKey ? "Using key from system environment" : "Enter Anthropic API Key"}
                                        value={claudeApiKey}
                                        onChange={(e) => handleKeyChange("claudeApiKey", e.target.value)}
                                    />
                                    <button 
                                        type="button" 
                                        onClick={() => setShowKey(!showKey)}
                                        className="show-hide-btn"
                                    >
                                        {showKey ? "Hide" : "Show"}
                                    </button>
                                </div>
                                {hasEnvClaudeKey && !claudeApiKey && (
                                    <p className="helper-text">
                                        Using the API key configured in the project's environment variables.
                                    </p>
                                )}
                            </div>
                        ) : (
                            <div className="form-group">
                                <label htmlFor="hf-key">Hugging Face Access Token</label>
                                <div className="key-input-container">
                                    <input
                                        id="hf-key"
                                        type={showKey ? "text" : "password"}
                                        placeholder={hasEnvHfKey ? "Using key from system environment" : "Enter Hugging Face Access Token"}
                                        value={hfAccessToken}
                                        onChange={(e) => handleKeyChange("hfAccessToken", e.target.value)}
                                    />
                                    <button 
                                        type="button" 
                                        onClick={() => setShowKey(!showKey)}
                                        className="show-hide-btn"
                                    >
                                        {showKey ? "Hide" : "Show"}
                                    </button>
                                </div>
                                {hasEnvHfKey && !hfAccessToken && (
                                    <p className="helper-text">
                                        Using the access token configured in the project's environment variables.
                                    </p>
                                )}
                            </div>
                        )}
                    </div>
                )}
            </section>

            <form action={addIngredient} className="add-ingredient-form">
                <input
                    type="text"
                    placeholder="e.g. oregano"
                    aria-label="Add ingredient"
                    name="ingredient"
                    disabled={isLoading}
                />
                <button disabled={isLoading}>Add ingredient</button>
            </form>

            <div className="ingredientTitle">
                <h2>Ingredients on hand:</h2>
                <p id="atleastIngredients">Add Atleast 4 ingredients</p>
            </div>

            {ingredients.length > 0 &&
                <IngredientsList
                    ref={recipeSection}
                    ingredients={ingredients}
                    getRecipe={getRecipe}
                    isLoading={isLoading}
                />
            }

            {error && <div className="status-message error">{error}</div>}
            {isLoading && <div className="status-message loading">Generating recipe... Please wait.</div>}

            {recipe && <ClaudeRecipe recipe={recipe} />}
        </main>
    )
}