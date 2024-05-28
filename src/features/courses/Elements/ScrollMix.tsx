function ScrollMix() {
  return (
    <div>
      <textarea
        id={element.id}
        placeholder={`Enter ${element.type}`}
        value={element.value?.toString()}
        onChange={(e) => handleInputChange(element.id, e.target.value)}
        className="w-[100%] border border-secondary-3 rounded-md outline-accent-6 bg-primary-4 p-2 my-3 placeholder:text-xl"
      />
      <div className="flex flex-col my-3 border-2 border-secondary-3 rounded-md hover:border-accent-5">
        <input
          type="file"
          id={element.id}
          onChange={(e) => handleFileInputChange(e, element.id)}
          className="w-[100%] file:mr-4 file:py-2 file:px-4
        file:rounded-md file:border-0 text-sm
        file:text-lg  text-secondary-6 font-bold p-2 file:bg-accent-6
        file:text-primary-6 file:font-nokia-bold  hover:file:bg-accent-7
        rounded-xs bg-transparent hover:text-secondary-5
        focus:outline-none focus:border-accent-8 cursor-pointer"
        />
        {imagePreviewUrl && (
          <img
            key={element.type}
            src={imagePreviewUrl}
            alt=""
            className="rounded-b-md"
          />
        )}
      </div>
      <textarea
        id={element.id}
        placeholder={`Enter ${element.type}`}
        value={element.value?.toString()}
        onChange={(e) => handleInputChange(element.id, e.target.value)}
        className="w-[100%] border border-secondary-3 rounded-md outline-accent-6 bg-primary-4 p-2 my-3 placeholder:text-xl"
      />
    </div>
  );
}

export default ScrollMix;
