
import { useCallback, useEffect, useRef, useState } from "react"
import { parseLinkHeader } from "./parseLinkHeader"
import "./styles.css"
export default function App(){
  const [photos, setPhotos] = useState([])
  const nextPhotoUrlRef = useRef()

  async function fetchPhotos(url){
    const res = await fetch (url)
    nextPhotoUrlRef.current = parseLinkHeader(res.headers.get("Link")).next
    const photos = await res.json()
    setPhotos(photos)
  }

  const imageRef = useCallback((image)=> {
    if(image == null) return

    const observer = new IntersectionObserver(entries => {
      if (entries[0].isIntersecting){
        //Todo: load next elements
        fetchPhotos(nextPhotoUrlRef.current)
        observer.unobserve(image)
      }
    })
    observer.observe(image)
         
  }, [])

  useEffect(() => {
   fetchPhotos()
  }, [])
  return (
    <div className="grid">
      {photos.map((photo, index) => (
        <img 
          src={photo.url} 
          key={photo.id}
          ref={index === photos.length -1 ? imageRef : undefined} 
          />
      ))}
    </div>
  )
}