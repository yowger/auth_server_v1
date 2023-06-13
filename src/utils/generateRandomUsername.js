function generateRandomUsername() {
    const adjectives = [
        "happy",
        "lucky",
        "sunny",
        "playful",
        "clever",
        "friendly",
        "brave",
        "smart",
        "energetic",
    ]
    const names = [
        "alice",
        "bob",
        "clara",
        "david",
        "emma",
        "frank",
        "grace",
        "harry",
        "isabella",
        "jack",
        "kate",
        "liam",
        "mia",
        "noah",
        "olivia",
        "peter",
        "quinn",
        "ruby",
        "samuel",
        "tessa",
        "ulric",
        "violet",
        "william",
        "xander",
        "yara",
        "zoe",
    ]

    const randomAdjectiveIndex = Math.floor(Math.random() * adjectives.length)
    const randomNameIndex = Math.floor(Math.random() * names.length)

    const randomAdjective = adjectives[randomAdjectiveIndex]
    const randomName = names[randomNameIndex]

    const randomNumber = Math.floor(Math.random() * 1000) // Generate a random number between 0 and 999

    const randomUsername = `${randomAdjective}-${randomName}-${randomNumber}`

    return randomUsername
}

module.exports = generateRandomUsername
