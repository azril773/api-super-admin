export const newDateLocal = () => {
    const date = new Date().toLocaleString("id-ID",{
        year:"numeric",
        month:"2-digit",
        day:"2-digit",
        hour:"2-digit",
        minute:"2-digit",
        second:"2-digit"
    })
    console.log(date)
    const pecahDate = date.split(",")[0].split("/")
    const pecahTime = date.split(" ")[1].trim().split(".").join(":")
    const tanggal = `${pecahDate[2]}-${pecahDate[1]}-${pecahDate[0]}`
   return new Date(`${tanggal}T${pecahTime}.000Z`)
}