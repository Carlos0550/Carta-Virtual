export interface CategoriesModal{
    opened: boolean,
    formType?: "edit" | "create"
}

export interface CategoriesForm{
    category_name: string,
    category_description: string
}