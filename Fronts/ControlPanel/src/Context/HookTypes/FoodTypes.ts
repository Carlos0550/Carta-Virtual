export interface FoodModal{
    opened: boolean,
    formType?: "edit" | "create",
}

export interface FoodForm{
    food_name: string,
    food_price: string,
    food_category: string,
    food_description: string,
    food_tags: string[],
    food_ingredients: string[],
    food_cautions: string
}