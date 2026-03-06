import "../styles/CategoryFilter.css";

function CategoryFilter({ categories, selectedCategory, setSelectedCategory }) {
  return (
    <div className="category-filter">
      {categories.map((cat) => (
        <button 
          key={cat} 
          className={selectedCategory === cat ? "active" : ""} 
          onClick={() => setSelectedCategory(cat)}
        >
          {cat}
        </button>
      ))}
    </div>
  );
}

export default CategoryFilter;
