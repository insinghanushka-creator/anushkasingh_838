const parts = row.split(",");

let name, followers, likes, comments;

if(parts.length >= 4){

    // User entered full data
    name = parts[0].trim();
    followers = parseInt(parts[1]);
    likes = parseInt(parts[2]);
    comments = parseInt(parts[3]);

}else{

    // User entered only name
    name = row.trim();

    followers =
    Math.floor(Math.random()*9000)+1000;

    likes =
    Math.floor(Math.random()*1200)+100;

    comments =
    Math.floor(Math.random()*250)+20;
}