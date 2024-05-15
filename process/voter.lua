Projects = Projects or {}

local projectIdCounter = 0

-- aajbSwRdSrIIErliiiXDvHVUkauSPa2vmBATGkjDcf4
-- .load ./process/voter.lua

function InitNewProject(name, siteURL, iconURL, stakeAmount, owner)
    return {
        Name = name,
        SiteURL = siteURL,
        IconURL = iconURL,
        Stake = stakeAmount,
        Owner = owner,
        Votes = {},
        ID = GetNewID(), --Give the projects its own id
    }
end

function GetNewID()
    projectIdCounter = projectIdCounter + 1
    return projectIdCounter
end

-- Send({ Target = ao.id, Action = "Add-Project", Name = "", SiteURL = "testsite.io", IconURL = "icon.xyz", Stake = "1000", Owner = ao.id })
-- Add Project Handler
Handlers.add(
    "Add-Project",
    Handlers.utils.hasMatchingTag("Action", "Add-Project"),
    function (msg)
      -- Add new project to the Projects table
        local newProject = InitNewProject(msg.Name, msg.SiteURL, msg.IconURL, msg.Stake, msg.Owner)
        table.insert(Projects, newProject)
        Handlers.utils.reply("Project Added: " .. msg.Name)(msg)
    end
)

-- Send({ Target = ao.id, Action = "Get-Project" })
Handlers.add(
    "Get-Project",
    Handlers.utils.hasMatchingTag("Action", "Get-Project"),
    function (msg)
        Send({Target = msg.id, Data = "Projects: " .. Projects})
        Handlers.utils.reply("Projects: " .. Projects)(msg)
    end
)

-- Vote Handler

-- Remove Votes Handler

-- Must add "CronTick" handler for cron to work

-- Remove Project By Admin Handler (make sure its this ao process)
-- Remove Project By Owner Handler